import { PoS, PoW } from "./chains/custom";

import { createContext } from "react";
import { useEthers } from "@usedapp/core";

export const ChainsContext = createContext<ReturnType<typeof useChains>>(null);

export default function useChains() {
  const { activateBrowserWallet, chainId, switchNetwork, active } = useEthers();

  const handleSwitchToPoS = () => {
      if (!active) activateBrowserWallet();
      switchNetwork(PoS.chainId);
    },
    handleSwitchToPoW = () => {
      if (!active) activateBrowserWallet();
      switchNetwork(PoW.chainId);
    };

  return {
    handleSwitchToPoS,
    handleSwitchToPoW,
    isPoS: chainId === PoS.chainId,
    isPoW: chainId === PoW.chainId,
    isETHAtAll: chainId === PoS.chainId || chainId === PoW.chainId,
  };
}
