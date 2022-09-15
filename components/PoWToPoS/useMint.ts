import { Interface, hexValue, hexZeroPad, keccak256 } from "ethers/lib/utils";
import { PoS, PoW } from "shared/chains/custom";
import { useContractFunction, useEthers } from "@usedapp/core";

import { Contract } from "@ethersproject/contracts";
import { encodeProof } from "shared/utils/encode-proof";
import { useMemo } from "react";
import useWrapTxInToasts from "shared/useTransactionToast";

const wPowEthInterface = new Interface([
    "function mint(uint256 depositId, address recipient, uint256 amount, uint256 depositBlockNumber, bytes memory storageProof)",
    "function updateDepositContractStorageRoot(uint256 blockNumber, bytes memory accountProof)",
    "function relayStateRoot(uint256 blockNumber, bytes32 stateRoot, bytes calldata signature)",
    "function multicall(bytes[] calldata data) external returns (bytes[] memory results)",
  ]),
  wPowEthAddress = process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS;

export default function useMint({
  powDepositId,
  powDepositInclusionBlock,
  powDepositAmount,
}) {
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

      console.log("do something when tx is done");

      // cleanup
      resetMintTxState();
    };

  useWrapTxInToasts(mintTxState, onMintComplete);

  const retrieveStateRoot = async (blockNumber: number) => {
    const { stateRoot } = await PoW.provider.send("eth_getBlockByNumber", [
      hexValue(blockNumber),
      true,
    ]);
    if (!stateRoot)
      throw new Error(`could not retrieve state root for block ${blockNumber}`);

    return stateRoot;
  };

  const getProof = async (hexKey: string, blockNumber: string) => {
    const paddedSlot = hexZeroPad("0x3", 32);
    const paddedKey = hexZeroPad(hexKey, 32);
    const itemSlot = keccak256(paddedKey + paddedSlot.slice(2));
    const proof = await PoW.provider.send("eth_getProof", [
      process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
      [itemSlot],
      hexValue(Number(blockNumber)),
    ]);
    return {
      storageProof: proof.storageProof[0].proof,
      accountProof: proof.accountProof,
    };
  };

  const handleMint = async () => {
    const inclusionBlockStateRoot = await retrieveStateRoot(
      Number(powDepositId)
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ORACLE_API_URL}/?chainHandle=eth-pow-mainnet&blockNumber=${powDepositInclusionBlock}`
    );
    const res = await response.json();
    const { envelope } = res;

    const proof = await getProof("0x3", powDepositInclusionBlock);

    console.log("powDepositId", powDepositId);
    console.log("powDepositInclusionBlock", powDepositInclusionBlock);

    console.log("inclusionBlockStateRoot", inclusionBlockStateRoot);
    console.log("account", account);

    // TODO: check if already minted.
    // console.log("contract addr", wPowEthContract.address);
    // console.log("provider", wPowEthContract);

    const multicallArgs = [
      wPowEthContract.interface.encodeFunctionData("relayStateRoot", [
        powDepositInclusionBlock,
        inclusionBlockStateRoot,
        envelope.signature,
      ]),
      // TODO: check if that this call is required.
      wPowEthContract.interface.encodeFunctionData(
        "updateDepositContractStorageRoot",
        [inclusionBlockStateRoot, encodeProof(proof.accountProof)]
      ),
      wPowEthContract.interface.encodeFunctionData("mint", [
        powDepositId,
        account,
        powDepositAmount,
        powDepositInclusionBlock,
        encodeProof(proof.storageProof),
      ]),
    ];

    const tx = await sendMintTx(multicallArgs);
    console.log(tx);
  };

  return { handleMint };
}
