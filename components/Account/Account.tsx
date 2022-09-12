import React, { useEffect } from "react";
import { shortenAddress, useEtherBalance, useEthers } from "@usedapp/core";

import { AccountStyled } from "./styles";

export default function Account() {
  const { account, activateBrowserWallet, deactivate } = useEthers();
  const etherBalance = useEtherBalance(account);

  useEffect(() => {
    console.log("account", account, etherBalance);
  }, [account, etherBalance]);

  return account ? (
    <AccountStyled>
      <div>Account: {shortenAddress(account)}</div>
      <div>
        Balance:{" "}
        {etherBalance && parseFloat(etherBalance.toString()).toFixed(4)}
      </div>
      <button onClick={deactivate}>Disconnect</button>
    </AccountStyled>
  ) : (
    <button onClick={activateBrowserWallet}>Connect</button>
  );
}
