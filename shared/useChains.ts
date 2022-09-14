import { PoS, PoW } from "./chains/custom";
import { createContext, useMemo } from "react";

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

  const provider = useMemo(
    () =>
      chainId === PoS.chainId
        ? PoS.provider
        : chainId === PoW.chainId
        ? PoW.provider
        : undefined,
    [chainId]
  );

  return {
    handleSwitchToPoS,
    handleSwitchToPoW,
    isPoS: chainId === PoS.chainId,
    isPoW: chainId === PoW.chainId,
    isETHAtAll: chainId === PoS.chainId || chainId === PoW.chainId,
    provider,
  };
}
