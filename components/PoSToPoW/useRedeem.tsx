import { Interface, hexValue } from "ethers/lib/utils";
import { PoS, PoW } from "shared/chains/custom";
import { useContractFunction, useEthers } from "@usedapp/core";

import { Contract } from "ethers";
import { encodeProof } from "shared/utils/encode-proof";
import getProof from "shared/utils/get-proof";
import retrieveStateRoot from "shared/utils/retreive-state-root";
import { toast } from "react-toastify";
import { useMemo } from "react";
import useWrapTxInToasts from "shared/useTransactionToast";

const depositPowInterface = new Interface([
    "function withdraw(uint256 withdrawalId, address recipient, uint256 amount, uint256 withdrawalBlockNumber, bytes memory storageProof)",
    "function multicall(bytes[] calldata data) external returns (bytes[] memory results)",
    "function updateWithdrawalContractStorageRoot(uint256 blockNumber, bytes memory accountProof)",
    "function relayStateRoot(uint256 blockNumber, bytes32 stateRoot, bytes calldata signature)",
  ]),
  depositPowAddress = process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS;

export default function useRedeem(getData, clearData, setIsLoading) {
  const { account } = useEthers();

  const depositPowContract = useMemo(
    () => new Contract(depositPowAddress, depositPowInterface, PoW.provider),
    []
  );

  const {
      state: redeemState,
      send: sendRedeem,
      resetState: resetRedeemState,
    } = useContractFunction(depositPowContract, "multicall", {
      transactionName: "Redeem ETHW",
    }),
    onRedeemComplete = async () => {
      const { transaction: tx, receipt, status } = redeemState;

      // TODO: save receipt.
      if (status === "Success") clearData();
      // cleanup
      resetRedeemState();
    };

  useWrapTxInToasts(redeemState, onRedeemComplete);

  const handleRedeem = async () => {
    const {
      posWithdrawalId,
      posWithdrawalAmount,
      posWithdrawalInclusionBlock,
    } = getData();

    if (
      !posWithdrawalId ||
      !posWithdrawalAmount ||
      !posWithdrawalInclusionBlock
    ) {
      return toast.dark(
        "No pending withdrawal found, did you first withdraw on PoS?",
        {
          type: "info",
        }
      );
    }

    setIsLoading(true);

    const inclusionBlockStateRoot = await retrieveStateRoot(
      Number(posWithdrawalInclusionBlock),
      PoS.provider
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ORACLE_API_URL}/?chainHandle=eth-pos-mainnet&blockNumber=${posWithdrawalInclusionBlock}`
    );
    const res = await response.json();
    const { envelope } = res;

    const proof = await getProof(
      "0x" + parseInt(posWithdrawalId).toString(16),
      posWithdrawalInclusionBlock,
      PoS.provider,
      process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS,
      "0x6"
    );
    if (proof.error) return resetRedeemState();

    const multicallArgs = [
      depositPowContract.interface.encodeFunctionData("relayStateRoot", [
        posWithdrawalInclusionBlock,
        inclusionBlockStateRoot,
        envelope.signature,
      ]),
      // TODO: check if that this call is required.
      depositPowContract.interface.encodeFunctionData(
        "updateWithdrawalContractStorageRoot",
        [posWithdrawalInclusionBlock, encodeProof(proof.accountProof)]
      ),
      depositPowContract.interface.encodeFunctionData("withdraw", [
        posWithdrawalId,
        account,
        posWithdrawalAmount,
        posWithdrawalInclusionBlock,
        encodeProof(proof.storageProof),
      ]),
    ];

    await sendRedeem(multicallArgs);

    setIsLoading(false);
  };

  return {
    redeemState,
    handleRedeem,
  };
}
