import React, { useContext, useState, useEffect } from "react";
import { useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";

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
      <input
        placeholder="ETH PoW amount"
        onChange={(e) => setPoWEthAmount(e.target.value)}
        value={poWEthAmount}
      />
      <button>mint</button>
    </div>
  );
}
