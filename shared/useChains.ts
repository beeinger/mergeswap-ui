import { createContext } from "react";
import { useEthers } from "@usedapp/core";
import { PoS, PoW } from "./chains/custom";

export const ChainsContext = createContext<ReturnType<typeof useChains>>(null);

export default function useChains() {
  const { account, activateBrowserWallet, chainId, switchNetwork } =
    useEthers();

  const handleSwitchToPoS = async () => {
      switchNetwork(PoS.chainId);
      activateBrowserWallet();
    },
    handleSwitchToPoW = async () => {
      switchNetwork(PoW.chainId);
      activateBrowserWallet();
    };

  return {
    account,
    chainId,
    handleSwitchToPoS,
    handleSwitchToPoW,
    isPoS: chainId === PoS.chainId,
    isPoW: chainId === PoW.chainId,
    isETHAtAll: chainId === PoS.chainId || chainId === PoW.chainId,
  };
}
