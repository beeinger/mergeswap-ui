import React, { useContext, useState } from "react";
import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { ChainsContext } from "shared/useChains";
import { useContractFunction } from "@usedapp/core";

const depositPowInterface = new utils.Interface([
  "function deposit(uint256 amount, address recipient) payable",
]);
const depositPowAddress = process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS;
const depositPowContract = new Contract(depositPowAddress, depositPowInterface);

export default function PoWToPoS() {
  const { account, isPoW } = useContext(ChainsContext);
  const [poWEthAmount, setPoWEthAmount] = useState("");

  const { state, send } = useContractFunction(depositPowContract, "deposit", {
    transactionName: "Deposit POWETH",
  });

  console.log(state);

  const handleDeposit = () => {
    console.log("handling deposit", poWEthAmount, account);
    send(utils.parseEther(poWEthAmount), account, {
      value: utils.parseEther(poWEthAmount),
    });
  };

  return isPoW ? (
    //? Always active (or when someone has any ETH on PoW)
    <div>
      <h4>Send PoW ETH to PoS</h4>
      <input
        placeholder="ETH amount"
        onChange={(e) => setPoWEthAmount(e.target.value)}
        value={poWEthAmount}
      />
      <button disabled={!account} onClick={handleDeposit}>
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
