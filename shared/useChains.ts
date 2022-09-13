import { useEffect, useMemo, useState } from "react";

import { createContext } from "react";
import { useEthers } from "@usedapp/core";

type NativeCurrency = {
  name: string;
  symbol: string; // 2-6 characters long
  decimals: 18;
};

const handleChainChange = async (
  chainId: string,
  chainName: string,
  rpcUrls: string[],
  nativeCurrency: NativeCurrency
) => {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      // TODO: UI modal instead (?)
      alert("Please install MetaMask and reload the page.");
      throw new Error("ethereum not found");
    }

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId,
              chainName,
              nativeCurrency,
              rpcUrls,
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    }
    console.error(switchError);
  }
};

export const switchToPoS = async () =>
    handleChainChange(
      "0x13881",
      "Mumbai", // PoS
      ["https://matic-mumbai.chainstacklabs.com"],
      {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      }
    ),
  switchToPoW = async () =>
    handleChainChange(
      "0x5",
      "Goerli Test Network", // PoW
      ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
      {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      }
    );

export const ChainsContext = createContext<ReturnType<typeof useChains>>(null);

export default function useChains() {
  const { activateBrowserWallet } = useEthers();
  const [chainId, setChainId] = useState(undefined);

  useEffect(() => {
    const injectedChainId = parseInt(window.ethereum.networkVersion);
    setChainId(injectedChainId);

    // Handling MetaMask event.
    window.ethereum.on("networkChanged", (_chainId: string) => {
      if (parseInt(_chainId) !== injectedChainId) {
        console.log("Network change detected, reloading app...");
        window.location.reload();
      }
    });
  }, []);

  const handleSwitchToPoS = async () => {
      await switchToPoS();
      activateBrowserWallet();
    },
    handleSwitchToPoW = async () => {
      await switchToPoW();
      activateBrowserWallet();
    };

  return {
    chainId,
    handleSwitchToPoS,
    handleSwitchToPoW,
    // TODO: update with production values.
    isPoS: chainId === 80001,
    isPoW: chainId === 5,
    isETHAtAll: chainId === 80001 || chainId === 5,
  };
}
