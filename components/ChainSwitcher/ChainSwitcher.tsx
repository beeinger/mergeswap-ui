import { Center, Option, StyledChainSwitcher } from "./styles";
import React, { useContext } from "react";

import { ChainsContext } from "shared/useChains";
import { useEthers } from "@usedapp/core";

export default function ChainSwitcher() {
  const { handleSwitchToPoS, handleSwitchToPoW, isETHAtAll, isPoS, isPoW } =
    useContext(ChainsContext);
  const { account, activateBrowserWallet } = useEthers();

  return (
    <StyledChainSwitcher>
      {/* //! change 5 to 1001 */}
      <Option
        isActive={isPoW}
        title={isPoW ? "You're on PoW ETH" : "Switch to PoW ETH"}
        onClick={handleSwitchToPoW}
      >
        PoW
      </Option>
      <Center onClick={!account ? activateBrowserWallet : undefined}>
        {account
          ? isETHAtAll
            ? "ETH"
            : "< choose network >"
          : "CONNECT WALLET"}
      </Center>
      <Option
        isActive={isPoS}
        title={isPoS ? "You're on PoS ETH" : "Switch to PoS ETH"}
        onClick={handleSwitchToPoS}
      >
        PoS
      </Option>
    </StyledChainSwitcher>
  );
}
