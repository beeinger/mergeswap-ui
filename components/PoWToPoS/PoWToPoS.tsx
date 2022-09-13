import React, { useContext, useState } from "react";
import { useContractFunction, useEthers } from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { Contract } from "@ethersproject/contracts";
import useWrapTxInToasts from "shared/useTransactionToast";
import { utils } from "ethers";

const depositPowInterface = new utils.Interface([
    "function deposit(uint256 amount, address recipient) payable",
  ]),
  depositPowAddress = process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
  depositPowContract = new Contract(depositPowAddress, depositPowInterface);

export default function PoWToPoS() {
  const { isPoW } = useContext(ChainsContext);
  const { account } = useEthers();
  const [poWEthAmount, setPoWEthAmount] = useState("");

  const { state, send, resetState } = useContractFunction(
    depositPowContract,
    "deposit",
    {
      transactionName: "Deposit POWETH",
    }
  );
  useWrapTxInToasts(state, resetState);

  const handleDeposit = () =>
    send(utils.parseEther(poWEthAmount), account, {
      value: utils.parseEther(poWEthAmount),
    });

  return isPoW ? (
    //? Always active (or when someone has any ETH on PoW)
    <div>
      <h4>Send PoW ETH to PoS</h4>
      <input
        placeholder="ETH amount"
        onChange={(e) => setPoWEthAmount(e.target.value)}
        value={poWEthAmount}
      />
      <button
        disabled={!account || state.status !== "None"}
        onClick={handleDeposit}
      >
        confirm
      </button>
    </div>
  ) : (
    //? Should be active only when someone has sent PoW ETH to PoS
    <div>
      <h4>Mint PoW ETH you&apos;ve sent to PoS</h4>
      <input
        placeholder="PoW ETH amount"
        onChange={(e) => setPoWEthAmount(e.target.value)}
        value={poWEthAmount}
      />
      <button>mint</button>
    </div>
  );
}
