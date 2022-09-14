import { PoS, PoW } from "./chains/custom";

import { createContext } from "react";
import { providers } from "ethers";
import { useEthers } from "@usedapp/core";

export const ChainsContext = createContext<ReturnType<typeof useChains>>(null);

export default function useChains() {
  const { activateBrowserWallet, chainId, switchNetwork, account } =
    useEthers();

  const handleSwitchToPoS = () => {
      if (!account) activateBrowserWallet();
      switchNetwork(PoS.chainId);
    },
    handleSwitchToPoW = () => {
      if (!account) activateBrowserWallet();
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
