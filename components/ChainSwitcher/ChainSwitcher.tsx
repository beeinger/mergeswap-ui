import { Center, Option, StyledChainSwitcher } from "./styles";
import React, { useContext } from "react";

import { ChainsContext } from "shared/useChains";
import { useEthers } from "@usedapp/core";

export default function ChainSwitcher() {
  const {
    handleSwitchToPoS,
    handleSwitchToPoW,
    isETHAtAll,
    isPoS,
    isPoW,
    connect,
  } = useContext(ChainsContext);

  const { account } = useEthers();

  return (
    <StyledChainSwitcher account={Boolean(account)}>
      <Option
        isActive={account && isPoW}
        title={isPoW ? "You're on ETH PoW" : "Switch to ETH PoW"}
        onClick={handleSwitchToPoW}
      >
        PoW
      </Option>
      <Center onClick={!account ? connect : undefined}>
        {account
          ? isETHAtAll
            ? "ETH"
            : "< choose network >"
          : "CONNECT WALLET"}
      </Center>
      <Option
        isActive={account && isPoS}
        title={isPoS ? "You're on PoS ETH" : "Switch to PoS ETH"}
        onClick={handleSwitchToPoS}
      >
        PoS
      </Option>
    </StyledChainSwitcher>
  );
}
