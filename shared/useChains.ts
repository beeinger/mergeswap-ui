import { PoS, PoW } from "./chains/custom";

import { createContext } from "react";
import { useEthers } from "@usedapp/core";
import { providers } from "ethers";

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

  let provider: undefined | providers.JsonRpcProvider;
  if (chainId === PoS.chainId) provider = PoS.provider;
  else if (chainId === PoW.chainId) provider = PoW.provider;

  return {
    handleSwitchToPoS,
    handleSwitchToPoW,
    isPoS: chainId === PoS.chainId,
    isPoW: chainId === PoW.chainId,
    isETHAtAll: chainId === PoS.chainId || chainId === PoW.chainId,
    provider,
  };
}
