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

export default function useMint() {
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

  const fetchUserDeposits = async (/* userAddress: string */) => {
    // TODO: replace with The Graph's subgraph call.
    const userDeposits = [
      {
        // blockNumber: "7597085",
        blockNumber: "7597413",
        id: parseInt("0x0", 16),
        proof: await getProof("0x0", "7597413"),
        amount: "30000000000000000",
        depositor: "0x6b477781b0e68031109f21887e6b5afeaaeb002b",
        recipient: "0x6b477781b0e68031109f21887e6b5afeaaeb002b",
      },
    ];
    return userDeposits;
  };

  const handleMint = async () => {
    console.log("handleMint");
    // TODO: properly handle confirmations.

    const userDeposits = await fetchUserDeposits(/*account*/);
    for (const userDeposit of userDeposits) {
      console.log("preparing minting params...");

      const inclusionBlockStateRoot = await retrieveStateRoot(
        Number(userDeposit.blockNumber)
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ORACLE_API_URL}/?chainHandle=eth-pow-mainnet&blockNumber=${userDeposit.blockNumber}`
      );
      const res = await response.json();
      console.log("-->", res);
      const { envelope } = res;

      console.log("powDepositId", userDeposit.id);
      console.log("powDepositInclusionBlock", userDeposit.blockNumber);
      console.log("powEthAmount", userDeposit.amount);
      console.log("storageProof", userDeposit.proof.storageProof);
      console.log("accountProof", userDeposit.proof.accountProof);

      console.log("inclusionBlockStateRoot", inclusionBlockStateRoot);
      console.log("account", account);
      console.log("envelope signature", envelope.signature);

      // TODO: check if already minted.
      // console.log("contract addr", wPowEthContract.address);
      // console.log("provider", wPowEthContract);
      console.log(
        "encoded account proof",
        encodeProof(userDeposit.proof.accountProof)
      );
      const multicallArgs = [
        wPowEthContract.interface.encodeFunctionData("relayStateRoot", [
          userDeposit.blockNumber,
          inclusionBlockStateRoot,
          envelope.signature,
        ]),
        // TODO: check if that this call is required.
        wPowEthContract.interface.encodeFunctionData(
          "updateDepositContractStorageRoot",
          [userDeposit.blockNumber, encodeProof(userDeposit.proof.accountProof)]
        ),
        wPowEthContract.interface.encodeFunctionData("mint", [
          userDeposit.id,
          userDeposit.recipient,
          userDeposit.amount,
          userDeposit.blockNumber,
          encodeProof(userDeposit.proof.storageProof),
        ]),
      ];

      const tx = await sendMintTx(multicallArgs);
      console.log(tx);
    }
  };

  return { handleMint };
}
