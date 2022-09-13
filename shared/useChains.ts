import { PoS, PoW } from "./chains/custom";

import { createContext } from "react";
import { useEthers } from "@usedapp/core";

export const ChainsContext = createContext<ReturnType<typeof useChains>>(null);

export default function useChains() {
  const { activateBrowserWallet, chainId, switchNetwork } = useEthers();

  const handleSwitchToPoS = async () => {
      switchNetwork(PoS.chainId);
      activateBrowserWallet();
    },
    handleSwitchToPoW = async () => {
      switchNetwork(PoW.chainId);
      activateBrowserWallet();
    };

  return {
    handleSwitchToPoS,
    handleSwitchToPoW,
    isPoS: chainId === PoS.chainId,
    isPoW: chainId === PoW.chainId,
    isETHAtAll: chainId === PoS.chainId || chainId === PoW.chainId,
  };
}
