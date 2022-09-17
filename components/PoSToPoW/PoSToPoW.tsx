import {
  Balance,
  ConfirmTransaction,
  EthInput,
  InteractionContainer,
  MaxButton,
} from "components/Path/styles";
import React, { useContext, useState } from "react";
import { useEthers, useTokenBalance } from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { formatEther } from "ethers/lib/utils";
import { useLocalWithdrawalData } from "components/PoWToPoS/useData";
import useRedeem from "./useRedeem";
import useWithdraw from "./useWithdraw";

export default function PoSToPoW() {
  const { isPoS } = useContext(ChainsContext);
  const [poWEthTokensAmount, setPoWEthTokensAmount] = useState("");
  const { account } = useEthers();
  const wPowEthBalance = useTokenBalance(
    process.env.NEXT_PUBLIC_WPOWETH_POS_ADDRESS!,
    account
  );
  const [isLoading, setIsLoading] = useState(false);

  const { setData, getData, clearData } = useLocalWithdrawalData();
  const { handleWithdrawal, withdrawalState } = useWithdraw({
    setIsLoading,
    setPoWEthTokensAmount,
    setData,
  });
  const { handleRedeem } = useRedeem({
    getData,
    clearData,
    setIsLoading,
  });

  return isPoS ? (
    //? Should be active only when person has our tokens that represent ETH PoW on PoS
    <InteractionContainer>
      <EthInput
        placeholder="0.0"
        onChange={(e) => setPoWEthTokensAmount(e.target.value)}
        value={poWEthTokensAmount.slice(0, 9)}
      />
      <Balance>
        Balance: {formatEther(wPowEthBalance || "0").slice(0, 7)}
        <MaxButton
          onClick={() =>
            setPoWEthTokensAmount(
              formatEther(wPowEthBalance.gte(0) ? wPowEthBalance : 0)
            )
          }
        >
          max
        </MaxButton>
      </Balance>
      <ConfirmTransaction
        disabled={withdrawalState.status !== "None" || isLoading}
        onClick={() => handleWithdrawal(wPowEthBalance.toString(), account)}
      >
        withdraw
      </ConfirmTransaction>
    </InteractionContainer>
  ) : (
    //? Should be active only when someone has burned our ETH PoW tokens on PoS
    <InteractionContainer>
      <EthInput placeholder="all" />
      {/* <EthInput disabled value={"all"} /> */}
      <Balance>redeem tokens withdrawn on PoS</Balance>
      <ConfirmTransaction onClick={() => handleRedeem(account)}>
        redeem
      </ConfirmTransaction>
    </InteractionContainer>
  );
}
