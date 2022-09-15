import { PoS, PoW } from "./chains/custom";
import { createContext, useEffect, useMemo, useState } from "react";

import agreeToContinue from "components/AgreeToContinue";
import { toast } from "react-toastify";
import { useEthers } from "@usedapp/core";

export const ChainsContext = createContext<ReturnType<typeof useChains>>(null);

const acceptUnauditedContractsRisk = () =>
  window.localStorage.setItem(
    "mergeswap_unaudited_contracts_risk_accepted",
    "yes"
  );

export default function useChains() {
  const { activateBrowserWallet, chainId, switchNetwork, account } =
    useEthers();
  const [networkSwitchInProgress, setNetworkSwitchInProgress] =
    useState<number>(null);

  const handleAccept = () => {
      acceptUnauditedContractsRisk();
      activateBrowserWallet();
    },
    connect = () => {
      toast.dark(
        <>
          Not yet launched, follow{" "}
          <a
            target="blank"
            href="https://twitter.com/0xmarcello?s=20&t=nQOfdihi6X2A062PFVDiSQ"
            style={{ color: "aqua" }}
          >
            @0xmarcello
          </a>{" "}
          on Twitter for updates.
        </>,
        {
          type: "warning",
        }
      );
      return;

      const isAccepted =
        window.localStorage.getItem(
          "mergeswap_unaudited_contracts_risk_accepted"
        ) === "yes";

      if (!isAccepted) {
        toast.dark(
          ({ closeToast }) => agreeToContinue(closeToast, handleAccept),
          {
            type: "warning",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false,
            containerId: "acceptance",
          }
        );
      } else return activateBrowserWallet();
    };

  const handleSwitchToPoS = () => {
      if (!account) {
        setNetworkSwitchInProgress(PoS.chainId);
        return connect();
      }
      return switchNetwork(PoS.chainId);
    },
    handleSwitchToPoW = () => {
      if (!account) {
        setNetworkSwitchInProgress(PoW.chainId);
        return connect();
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
    connect,
  };
}
