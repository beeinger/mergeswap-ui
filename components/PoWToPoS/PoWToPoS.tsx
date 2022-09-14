import {
  Balance,
  ConfirmTransaction,
  EthInput,
  InteractionContainer,
  MaxButton,
} from "components/Path/styles";
import React, { useContext, useState } from "react";
import { useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { Contract } from "@ethersproject/contracts";
import { formatEther } from "ethers/lib/utils";
import useWrapTxInToasts from "shared/useTransactionToast";
import { utils } from "ethers";

export default function PoWToPoS() {
  const { isPoW, provider } = useContext(ChainsContext);
  const { account } = useEthers();
  const [poWEthAmount, setPoWEthAmount] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const depositPowInterface = new utils.Interface([
      "function deposit(uint256 amount, address recipient) payable",
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
    await send(utils.parseEther(poWEthAmount), account, {
      value: utils.parseEther(poWEthAmount),
    });
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
    const costInWei = utils.formatUnits(
      gasUnitsEstimate.mul(gasPrice).mul(4),
      "wei"
    );
    console.log(costInWei);
    const maxAmount = amount.sub(costInWei);
    setPoWEthAmount(formatEther(maxAmount.gte(0) ? maxAmount : 0));
    setIsLoading(false);
  };

  return isPoW ? (
    //? Always active (or when someone has any ETH on PoW)
    <InteractionContainer>
      <EthInput
        placeholder="0.0"
        onChange={(e) => setPoWEthAmount(e.target.value)}
        value={poWEthAmount}
      />
      <Balance>
        Balance: {0.0123}
        <MaxButton
          onClick={setMax}
          disabled={etherBalance === undefined || isLoading}
        >
          max
        </MaxButton>
      </Balance>
      <ConfirmTransaction
        disabled={!account || state.status !== "None" || isLoading}
        onClick={handleDeposit}
      >
        deposit
      </ConfirmTransaction>
    </InteractionContainer>
  ) : (
    //? Should be active only when someone has sent ETH PoW to PoS
    <div>
      <input
        placeholder="ETH PoW amount"
        onChange={(e) => setPoWEthAmount(e.target.value)}
        value={poWEthAmount}
      />
      <button>mint</button>
    </div>
  );
}
