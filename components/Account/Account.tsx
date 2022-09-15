import { AccountAddress, AccountDisconnect, AccountStyled } from "./styles";
import { shortenAddress, useEthers } from "@usedapp/core";

import { AiOutlineDisconnect } from "react-icons/ai";
import React from "react";
import { toast } from "react-toastify";

export default function Account() {
  const { account, deactivate } = useEthers();

  return (
    account && (
      <AccountStyled>
        <AccountAddress
          title="Copy address"
          isActive={false}
          onClick={async () => {
            await navigator.clipboard.writeText(account);
            toast.dark("Address copied to clipboard!", { type: "success" });
          }}
        >
          {shortenAddress(account)}
        </AccountAddress>
        <AccountDisconnect title="Disconnect wallet" onClick={deactivate}>
          <AiOutlineDisconnect />
        </AccountDisconnect>
      </AccountStyled>
    )
  );
}
