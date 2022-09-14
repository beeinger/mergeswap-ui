import React, { useContext, useState, useEffect } from "react";
import {
  useCalls,
  useContractFunction,
  useEtherBalance,
  useEthers,
  useSendTransaction,
} from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { Contract } from "@ethersproject/contracts";
import useWrapTxInToasts from "shared/useTransactionToast";
import {
  formatEther,
  hexZeroPad,
  keccak256,
  parseEther,
  formatUnits,
  Interface,
} from "ethers/lib/utils";
import {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import { encodeProof } from "shared/utils/encode-proof";
import { PoW } from "shared/chains/custom";

export default function PoWToPoS() {
  const { isPoW, provider } = useContext(ChainsContext);
  const { account } = useEthers();
  const [poWEthAmount, setPoWEthAmount] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const depositPowInterface = new Interface([
      "function deposit(uint256 amount, address recipient) payable",
      "event Deposit(uint256 id, uint256 amount, address depositor, address recipient)",
    ]),
    depositPowAddress = process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
    depositPowContract = new Contract(
      depositPowAddress,
      depositPowInterface,
      provider
    );

  const wPowEthInterface = new Interface([
      "function mint(uint256 depositId, address recipient, uint256 amount, uint256 depositBlockNumber, bytes memory storageProof)",
      "function updateDepositContractStorageRoot(uint256 blockNumber, bytes memory accountProof)",
    ]),
    wPowEthAddress = process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS,
    wPowEthContract = new Contract(wPowEthAddress, wPowEthInterface, provider);

  const { state, send, resetState } = useContractFunction(
    depositPowContract,
    "deposit",
    {
      transactionName: "Deposit POWETH",
    }
  );
  const etherBalance = useEtherBalance(account);

  useWrapTxInToasts(state, () => {
    console.log("do something when tx is done");
    resetState();
  });

  const handleDeposit = async () => {
    if (!account) throw new Error("no recipient specified");
    setIsLoading(true);
    await send(parseEther(poWEthAmount), account, {
      value: parseEther(poWEthAmount),
    });
    setPoWEthAmount("");
    setIsLoading(false);
  };

  const setMax = async () => {
    setIsLoading(true);
    const amount = etherBalance;
    const gasUnitsEstimate = await depositPowContract.estimateGas.deposit(
      amount,
      account,
      {
        value: amount,
      }
    );
    console.log(gasUnitsEstimate);
    const gasPrice = await provider.getGasPrice();
    // We multiply by 4 to absorb gasPrice volatility + future withdraw call.
    const costInWei = formatUnits(gasUnitsEstimate.mul(gasPrice).mul(4), "wei");
    const maxAmount = amount.sub(costInWei);
    setPoWEthAmount(formatEther(maxAmount.gte(0) ? maxAmount : 0));
    setIsLoading(false);
  };

  useEffect(() => {
    const genDepositProof = async (
      tx: TransactionResponse,
      receipt: TransactionReceipt
    ) => {
      await tx.wait(
        Number(process.env.NEXT_PUBLIC_DEPOSIT_BLOCKS_CONFIRMATIONS)
      );
      console.log(receipt);

      const { args } = depositPowContract.interface.parseLog(receipt.logs[0]);

      console.log("key", args[0].toHexString());
      const paddedSlot = hexZeroPad("0x3", 32);
      const paddedKey = hexZeroPad(args[0].toHexString(), 32);
      const itemSlot = keccak256(paddedKey + paddedSlot.slice(2));
      const storageAt = await provider.getStorageAt(
        process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
        itemSlot
      );
      console.log("storageAt", storageAt);

      const proof = await provider.send("eth_getProof", [
        process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
        [storageAt],
        "latest",
      ]);
      console.log("proof", proof);
      // TODO: save the proof.
    };

    if (state.status === "Success") {
      genDepositProof(state.transaction, state.receipt);
    }
  }, [state, provider, depositPowContract.interface]);

  const { sendTransaction } = useSendTransaction();

  const handleMint = async () => {
    const depositEntities = [
      {
        id: "0x0",
        amount: "10000000000000000",
        depositor: "0x6b477781b0e68031109f21887e6b5afeaaeb002b",
        recipient: "0x6b477781b0e68031109f21887e6b5afeaaeb002b",
        blockNumber: "7590815",
        storageProof: null,
      },
      // {
      //   id: "0x1",
      //   amount: "20000000000000000",
      //   depositor: "0x6b477781b0e68031109f21887e6b5afeaaeb002b",
      //   recipient: "0x6b477781b0e68031109f21887e6b5afeaaeb002b",
      //   blockNumber: "7590865",
      //   storageProof: null,
      // },
    ];
    console.log("->", process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS);
    // Get proofs
    for (const depositEntity of depositEntities) {
      const paddedSlot = hexZeroPad("0x3", 32);
      const paddedKey = hexZeroPad(depositEntity.id, 32);
      const itemSlot = keccak256(paddedKey + paddedSlot.slice(2));
      const storageAt = await PoW.provider.getStorageAt(
        process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
        itemSlot
      );
      console.log("storageAt", storageAt);

      const proof = await PoW.provider.send("eth_getProof", [
        process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
        [storageAt],
        "latest",
      ]);
      console.log("proof", proof);
      depositEntity.storageProof = encodeProof(proof.storageProof[0].proof);
      // TODO: check if needed
      const accountProofEncoded = encodeProof(proof.accountProof);
      const update = await sendTransaction({
        to: process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS,
        data: wPowEthContract.interface.encodeFunctionData(
          "updateDepositContractStorageRoot",
          [depositEntity.blockNumber, accountProofEncoded]
        ),
      });
      console.log("update", update);
    }
    console.table(depositEntities);

    const calldata =
      depositEntities.map(
        ({ id, amount, recipient, blockNumber, storageProof }) =>
          wPowEthContract.interface.encodeFunctionData("mint", [
            parseInt(id, 16).toString(),
            recipient,
            amount,
            blockNumber,
            storageProof,
          ])
      ) ?? [];

    const r = await sendTransaction({
      to: process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS,
      data: calldata.join(""),
    });
    console.log(r);
    // const results = useCalls(calls) ?? [];
    // results.forEach((result, idx) => {
    //   if (result && result.error) {
    //     console.error(
    //       `Error encountered calling 'mint' on ${calls[idx]?.contract.address}: ${result.error.message}`
    //     );
    //   }
    // });
    // console.log("results", results);
    // if (depositEntities.length) setDepositEntities([]);
    // return results.map((result) => result?.value?.[0]);
  };

  return isPoW ? (
    //? Always active (or when someone has any ETH on PoW)
    <div>
      <h4>Deposit ETH (PoW)</h4>
      <div>
        <input
          placeholder="ETH amount"
          onChange={(e) => setPoWEthAmount(e.target.value)}
          value={poWEthAmount}
        />
        <button
          disabled={etherBalance === undefined || isLoading}
          onClick={setMax}
        >
          max
        </button>
      </div>
      <button
        disabled={!account || state.status !== "None" || isLoading}
        onClick={handleDeposit}
      >
        confirm
      </button>
    </div>
  ) : (
    //? Should be active only when someone has sent ETH PoW to PoS
    <div>
      <h4>Mint ETH PoW you&apos;ve sent to PoS</h4>
      {/* <input
        placeholder="ETH PoW amount"
        onChange={(e) => setPoWEthAmount(e.target.value)}
        value={poWEthAmount}
      /> */}
      <button onClick={handleMint}>mint</button>
    </div>
  );
}
