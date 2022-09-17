import {
  Balance,
  ConfirmTransaction,
  EthInput,
  InteractionContainer,
  MaxButton,
} from "components/Path/styles";
import React, { useContext, useState } from "react";

import { ChainsContext } from "shared/useChains";
import { formatEther } from "ethers/lib/utils";
import { useEthers } from "@usedapp/core";
import { useLocalWithdrawalData } from "shared/useData";
import useRedeem from "./useRedeem";
import useWithdraw from "./useWithdraw";

export default function PoSToPoW() {
  const { isPoS } = useContext(ChainsContext);
  const [poWEthTokensAmount, setPoWEthTokensAmount] = useState("");
  const { account } = useEthers();
  const [isLoading, setIsLoading] = useState(false);

  const { setData, getData, clearData, isThereUnclaimedWithdrawal } =
    useLocalWithdrawalData();
  const { handleWithdrawal, withdrawalState, setMax, wPowEthBalance } =
    useWithdraw(
      [poWEthTokensAmount, setPoWEthTokensAmount],
      setIsLoading,
      setData,
      isThereUnclaimedWithdrawal
    );
  const { handleRedeem } = useRedeem(getData, clearData);

  return isPoS ? (
    //? Should be active only when person has our tokens that represent ETH PoW on PoS
    <InteractionContainer>
      <EthInput
        placeholder="0.0"
        onChange={(e) =>
          /^[0-9]*\.?[0-9]*$/.test(e.target.value) &&
          setPoWEthTokensAmount(e.target.value)
        }
        value={poWEthTokensAmount.slice(0, 9)}
      />
      <Balance>
        Balance: {formatEther(wPowEthBalance || "0").slice(0, 7)}
        <MaxButton onClick={setMax}>max</MaxButton>
      </Balance>
      <ConfirmTransaction
        disabled={withdrawalState.status !== "None" || isLoading}
        onClick={handleWithdrawal}
      >
        withdraw
      </ConfirmTransaction>
    </InteractionContainer>
  ) : (
    //? Should be active only when someone has burned our ETH PoW tokens on PoS
    <InteractionContainer>
      <EthInput disabled value={"all"} />
      <Balance>redeem tokens withdrawn on PoS</Balance>
      <ConfirmTransaction onClick={handleRedeem}>redeem</ConfirmTransaction>
    </InteractionContainer>
  );
}
