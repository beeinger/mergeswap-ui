import { createContext } from "react";
import { useEthers } from "@usedapp/core";

export const ChainsContext = createContext<ReturnType<typeof useChains>>(null);

const POS_CHAIN_ID = 80001,
  POW_CHAIN_ID = 5;

export default function useChains() {
  const { activateBrowserWallet, chainId, switchNetwork } = useEthers();

  const handleSwitchToPoS = async () => {
      switchNetwork(POS_CHAIN_ID);
      activateBrowserWallet();
    },
    handleSwitchToPoW = async () => {
      switchNetwork(POW_CHAIN_ID);
      activateBrowserWallet();
    };

  return {
    chainId,
    handleSwitchToPoS,
    handleSwitchToPoW,
    // TODO: update with production values.
    isPoS: chainId === POS_CHAIN_ID,
    isPoW: chainId === POW_CHAIN_ID,
    isETHAtAll: chainId === POS_CHAIN_ID || chainId === POW_CHAIN_ID,
  };
}
