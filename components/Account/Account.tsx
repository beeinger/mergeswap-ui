import React, { useEffect } from "react";
import { shortenAddress, useEthers } from "@usedapp/core";

import { AccountStyled } from "./styles";

export default function Account() {
  const { account, activateBrowserWallet, deactivate } = useEthers();

  useEffect(() => {
    if (!account) return;

    // (window as any).ethereum.request({
    //   method: "wallet_addEthereumChain",
    //   params: [
    //     {
    //       chainId: "0x1",
    //       chainName: "Ethereum PoW",
    //       nativeCurrency: {
    //         name: "ETH",
    //         symbol: "ETH", // 2-6 characters long
    //         decimals: 18,
    //       },
    //       blockExplorerUrls: ["https://etherscan.io"],
    //       rpcUrls: ["https://rpc.mergeswap.xyz"],
    //     },
    //   ],
    // });

    // (window as any).web3.currentProvider.on("chainChanged", (e: any) => {
    //   console.log(e);
    // });
  }, [account]);

  return (
    <AccountStyled>
      {account && (
        <>
          <div>Account: {shortenAddress(account)}</div>
          <button onClick={deactivate}>Disconnect</button>
        </>
      )}
    </AccountStyled>
  );
}
