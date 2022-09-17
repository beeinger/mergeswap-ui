import { Interface, hexValue, hexZeroPad, keccak256 } from "ethers/lib/utils";
import { PoS, PoW } from "shared/chains/custom";

import { Contract } from "ethers";
import { WithdrawalData } from "components/PoWToPoS/useData";
import { encodeProof } from "shared/utils/encode-proof";
import { toast } from "react-toastify";
import { useContractFunction } from "@usedapp/core";
import { useMemo } from "react";
import useWrapTxInToasts from "shared/useTransactionToast";

const depositPowInterface = new Interface([
  "function withdraw(uint256 withdrawalId, address recipient, uint256 amount, uint256 withdrawalBlockNumber, bytes memory storageProof)",
  "function multicall(bytes[] calldata data) external returns (bytes[] memory results)",
  "function updateWithdrawalContractStorageRoot(uint256 blockNumber, bytes memory accountProof)",
  "function relayStateRoot(uint256 blockNumber, bytes32 stateRoot, bytes calldata signature)",
]);

const depositPowAddress = process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS;

const getProof = async (mapKey: string, blockNumber: string) => {
  const paddedSlot = hexZeroPad("0x6", 32);
  const paddedKey = hexZeroPad(mapKey, 32);
  const itemSlot = keccak256(paddedKey + paddedSlot.slice(2));

  const proof = await PoS.provider
    .send("eth_getProof", [
      process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS,
      [itemSlot],
      hexValue(Number(blockNumber)),
    ])
    .catch((err) => {
      toast.dark(
        "😕 Sorry, the network is out-of-sync (not our fault), please try again!)"
      );
      return { error: true, message: err.message };
    });

  return {
    storageProof: proof?.storageProof?.[0]?.proof,
    accountProof: proof?.accountProof,
    error: proof?.error || false,
    message: proof?.message || "",
  };
};

export default function useRedeem({ getData, clearData, setIsLoading }) {
  // const toastId = useRef(null);

  const depositPowContract = useMemo(
    () => new Contract(depositPowAddress, depositPowInterface, PoW.provider),
    []
  );

  const {
    state: redeemState,
    send: sendRedeem,
    resetState: resetRedeemState,
  } = useContractFunction(depositPowContract, "multicall", {
    transactionName: "Redeem POWETH",
  });

  const retrieveStateRoot = async (blockNumber: number) => {
    const { stateRoot } = await PoS.provider.send("eth_getBlockByNumber", [
      hexValue(blockNumber),
      true,
    ]);
    if (!stateRoot)
      throw new Error(`could not retrieve state root for block ${blockNumber}`);

    return stateRoot;
  };

  const handleRedeem = async (recipient: string) => {
    if (!recipient) throw new Error("no recipient specified");

    setIsLoading(true);

    const data: WithdrawalData = getData();
    if (
      !data.posWithdrawalId ||
      !data.posWithdrawalAmount ||
      !data.posWithdrawalInclusionBlock
    ) {
      return toast.dark(
        "No pending withdrawal found, did you first withdraw on PoS?",
        {
          type: "info",
        }
      );
    }
    const inclusionBlockStateRoot = await retrieveStateRoot(
      Number(data.posWithdrawalInclusionBlock)
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ORACLE_API_URL}/?chainHandle=eth-pos-mainnet&blockNumber=${data.posWithdrawalInclusionBlock}`
    );
    const res = await response.json();
    const { envelope } = res;
    const proof = await getProof(
      "0x" + parseInt(data.posWithdrawalId).toString(16),
      data.posWithdrawalInclusionBlock
    );
    if (proof.error) return resetRedeemState();
    const multicallArgs = [
      depositPowContract.interface.encodeFunctionData("relayStateRoot", [
        data.posWithdrawalInclusionBlock,
        inclusionBlockStateRoot,
        envelope.signature,
      ]),
      // TODO: check if that this call is required.
      depositPowContract.interface.encodeFunctionData(
        "updateWithdrawalContractStorageRoot",
        [data.posWithdrawalInclusionBlock, encodeProof(proof.accountProof)]
      ),
      depositPowContract.interface.encodeFunctionData("withdraw", [
        data.posWithdrawalId,
        recipient,
        data.posWithdrawalAmount,
        data.posWithdrawalInclusionBlock,
        encodeProof(proof.storageProof),
      ]),
    ];

    const receipt = await sendRedeem(multicallArgs);

    setIsLoading(false);
  };

  const onRedeemComplete = async () => {
    const { transaction: tx, receipt, status } = redeemState;

    // TODO: save receipt.

    if (status === "Success") clearData();
    // cleanup
    resetRedeemState();
  };

  useWrapTxInToasts(redeemState, onRedeemComplete);

  return {
    handleRedeem,
    sendRedeem,
    redeemState,
    resetRedeemState,
  };
}
