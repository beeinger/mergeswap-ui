import { PoS, PoW } from "./chains/custom";
import { createContext, useEffect, useMemo, useState } from "react";

import { useEthers } from "@usedapp/core";

export const ChainsContext = createContext<ReturnType<typeof useChains>>(null);

export default function useChains() {
  const { activateBrowserWallet, chainId, switchNetwork, account } =
    useEthers();
  const [networkSwitchInProgress, setNetworkSwitchInProgress] =
    useState<number>(null);

  const handleSwitchToPoS = () => {
      if (!account) {
        setNetworkSwitchInProgress(PoS.chainId);
        return activateBrowserWallet();
      }
      return switchNetwork(PoS.chainId);
    },
    handleSwitchToPoW = () => {
      if (!account) {
        setNetworkSwitchInProgress(PoW.chainId);
        return activateBrowserWallet();
      }
      return switchNetwork(PoW.chainId);
    };

  useEffect(() => {
    if (account && networkSwitchInProgress) {
      setNetworkSwitchInProgress(null);
      switchNetwork(networkSwitchInProgress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkSwitchInProgress, account]);

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
