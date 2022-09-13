import React from "react";
import { shortenAddress, useEthers } from "@usedapp/core";

import { AccountStyled } from "./styles";

export default function Account() {
  const { account, deactivate } = useEthers();

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
