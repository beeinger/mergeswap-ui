import { useEffect, useMemo, useState } from "react";

import { createContext } from "react";
import { useEthers } from "@usedapp/core";

export const switchToPoS = async () =>
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    }),
  switchToPoW = async () =>
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      //! change to "0x3E9"
      params: [{ chainId: "0x5" }],
    });

export const ChainsContext = createContext<ReturnType<typeof useChains>>(null);

export default function useChains() {
  const { account, chainId: _chainId, activateBrowserWallet } = useEthers();
  //? For some reason chainId from useEthers goes to undefined after switching network, hence the persisting chainId solution below
  const [chainId, setChainId] = useState(undefined);

  const isPoS = useMemo(() => chainId === 1, [chainId]),
    //! change 5 to 1001
    isPoW = useMemo(() => chainId === 5, [chainId]),
    isETHAtAll = useMemo(() => isPoS || isPoW, [isPoS, isPoW]);

  useEffect(() => {
    account
      ? _chainId !== undefined && setChainId(_chainId)
      : setChainId(undefined);
  }, [account, _chainId]);

  const handleSwitchToPoS = async () => {
      await activateBrowserWallet();
      switchToPoS();
    },
    handleSwitchToPoW = async () => {
      await activateBrowserWallet();
      switchToPoW();
    };

  return {
    chainId,
    isETHAtAll,
    handleSwitchToPoS,
    handleSwitchToPoW,
    isPoS,
    isPoW,
  };
}
