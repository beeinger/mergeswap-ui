import { Interface, hexValue, parseEther } from "ethers/lib/utils";
import { PoS, PoW } from "shared/chains/custom";
import { useContractFunction, useEthers } from "@usedapp/core";

import { Contract } from "@ethersproject/contracts";
import { encodeProof } from "shared/utils/encode-proof";
import getProof from "shared/utils/get-proof";
import retrieveStateRoot from "shared/utils/retreive-state-root";
import { toast } from "react-toastify";
import { useMemo } from "react";
import useWrapTxInToasts from "shared/useTransactionToast";

const wPowEthInterface = new Interface([
    "function mint(uint256 depositId, address recipient, uint256 amount, uint256 depositBlockNumber, bytes memory storageProof)",
    "function updateDepositContractStorageRoot(uint256 blockNumber, bytes memory accountProof)",
    "function relayStateRoot(uint256 blockNumber, bytes32 stateRoot, bytes calldata signature)",
    "function multicall(bytes[] calldata data) external returns (bytes[] memory results)",
  ]),
  wPowEthAddress = process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS;

export default function useMint(getData, clearData, setIsLoading) {
  const { account } = useEthers();

  const wPowEthContract = useMemo(
    () => new Contract(wPowEthAddress, wPowEthInterface, PoS.provider),
    []
  );

  //? Mint wPoWETH
  const {
      state: mintTxState,
      send: sendMintTx,
      resetState: resetMintTxState,
    } = useContractFunction(wPowEthContract, "multicall", {
      transactionName: "mint",
    }),
    onMintComplete = async () => {
      const { transaction: tx, receipt, status } = mintTxState;

      if (status === "Success") clearData();

      // cleanup
      resetMintTxState();
    };

  useWrapTxInToasts(mintTxState, onMintComplete);

  const handleMint = async () => {
    const { powDepositId, powDepositInclusionBlock, powDepositAmount } =
      getData();

    if (!powDepositId || !powDepositInclusionBlock || !powDepositAmount)
      return toast.dark("There is no deposit to mint, first make one on PoW", {
        type: "info",
      });

    setIsLoading(true);
    const inclusionBlockStateRoot = await retrieveStateRoot(
      Number(powDepositInclusionBlock),
      PoW.provider
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ORACLE_API_URL}/?chainHandle=eth-pow-mainnet&blockNumber=${powDepositInclusionBlock}`
    );
    const res = await response.json();
    const { envelope } = res;

    const proof = await getProof(
      "0x" + parseInt(powDepositId).toString(16),
      powDepositInclusionBlock,
      PoW.provider,
      process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
      "0x3"
    );
    if (proof.error) return resetMintTxState();

    const multicallArgs = [
      wPowEthContract.interface.encodeFunctionData("relayStateRoot", [
        powDepositInclusionBlock,
        inclusionBlockStateRoot,
        envelope.signature,
      ]),
      // TODO: check if that this call is required.
      wPowEthContract.interface.encodeFunctionData(
        "updateDepositContractStorageRoot",
        [powDepositInclusionBlock, encodeProof(proof.accountProof)]
      ),
      wPowEthContract.interface.encodeFunctionData("mint", [
        powDepositId,
        account,
        parseEther(powDepositAmount),
        powDepositInclusionBlock,
        encodeProof(proof.storageProof),
      ]),
    ];

    await sendMintTx(multicallArgs);

    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS,
          symbol: "WPoWETH",
          decimals: 18,
          image: "https://dev.mergeswap.xyz/logo.svg",
        },
      },
    });

    setIsLoading(false);
  };

  return { handleMint, mintTxState };
}
