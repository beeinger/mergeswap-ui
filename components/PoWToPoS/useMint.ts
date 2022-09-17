import {
  Interface,
  hexValue,
  hexZeroPad,
  keccak256,
  parseEther,
} from "ethers/lib/utils";
import { PoS, PoW } from "shared/chains/custom";
import { useContractFunction, useEthers } from "@usedapp/core";

import { Contract } from "@ethersproject/contracts";
import { encodeProof } from "shared/utils/encode-proof";
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

const getProof = async (mapKey: string, blockNumber: string) => {
  const paddedSlot = hexZeroPad("0x3", 32);
  const paddedKey = hexZeroPad(mapKey, 32);
  const itemSlot = keccak256(paddedKey + paddedSlot.slice(2));

  const proof = await PoW.provider
    .send("eth_getProof", [
      process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
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

export default function useMint(handleCheck, clearData) {
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

  const retrieveStateRoot = async (blockNumber: number) => {
    const { stateRoot } = await PoW.provider.send("eth_getBlockByNumber", [
      hexValue(blockNumber),
      true,
    ]);
    if (!stateRoot)
      throw new Error(`could not retrieve state root for block ${blockNumber}`);

    return stateRoot;
  };

  const handleMint = async () => {
    const { powDepositId, powDepositInclusionBlock, powDepositAmount } =
      handleCheck();

    if (!powDepositId || !powDepositInclusionBlock || !powDepositAmount)
      return toast.dark("There is no deposit to mint, first make one on PoW", {
        type: "info",
      });

    const inclusionBlockStateRoot = await retrieveStateRoot(
      Number(powDepositInclusionBlock)
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ORACLE_API_URL}/?chainHandle=eth-pow-mainnet&blockNumber=${powDepositInclusionBlock}`
    );
    const res = await response.json();
    const { envelope } = res;

    // handle error
    const proof = await getProof(
      "0x" + parseInt(powDepositId).toString(16),
      powDepositInclusionBlock
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
  };

  return { handleMint };
}
