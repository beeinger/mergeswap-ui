import {
  Balance,
  ConfirmTransaction,
  EthInput,
  InteractionContainer,
  MaxButton,
} from "components/Path/styles";
import React, { useContext, useState } from "react";
import { useEtherBalance, useEthers } from "@usedapp/core";

import { ChainsContext } from "shared/useChains";
import { formatEther } from "ethers/lib/utils";
import useDeposit from "./useDeposit";
import { useLocalDepositData } from "./useData";
import useMint from "./useMint";

export default function PoWToPoS() {
  const [poWEthAmount, setPoWEthAmount] = useState(""),
    [isLoading, setIsLoading] = useState<boolean>(false);

  const { isPoW } = useContext(ChainsContext),
    { account } = useEthers(),
    etherBalance = useEtherBalance(account);

  const {
      setData,
      isThereUnclaimedDeposit,
      getData: handleCheck,
      clearData,
    } = useLocalDepositData(),
    { depositState, handleDeposit, setMax } = useDeposit(
      [poWEthAmount, setPoWEthAmount],
      setIsLoading,
      setData,
      isThereUnclaimedDeposit
    ),
    { handleMint } = useMint(handleCheck, clearData);

  return isPoW ? (
    //? Always active (or when someone has any ETH on PoW)
    <InteractionContainer>
      <EthInput
        placeholder="0.0"
        onChange={(e) =>
          /^[0-9]*\.?[0-9]*$/.test(e.target.value) &&
          setPoWEthAmount(e.target.value)
        }
        value={poWEthAmount.slice(0, 9)}
      />
      <Balance>
        Balance: {formatEther(etherBalance || "0").slice(0, 7)}
        <MaxButton
          onClick={setMax}
          disabled={etherBalance === undefined || isLoading}
        >
          max
        </MaxButton>
      </Balance>
      <ConfirmTransaction
        disabled={depositState.status !== "None" || isLoading}
        onClick={handleDeposit}
      >
        deposit
      </ConfirmTransaction>
    </InteractionContainer>
  ) : (
    //? Should be active only when someone has sent ETH PoW to PoS
    <InteractionContainer>
      <EthInput
        placeholder="0.0"
        disabled
        //TODO display amount here
        value={"all"}
      />
      <Balance>mint tokens deposited on PoW</Balance>
      <ConfirmTransaction onClick={handleMint}>mint</ConfirmTransaction>
    </InteractionContainer>
  );
}
