import { AccountAddress, AccountDisconnect, AccountStyled } from "./styles";
import { shortenAddress, useEthers } from "@usedapp/core";

import { AiOutlineDisconnect } from "react-icons/ai";
import React from "react";
import { toast } from "react-toastify";

export default function Account() {
  const { account, deactivate } = useEthers();

  const handleDisconnect = () => {
    if (typeof window !== "undefined") deactivate();
  };

  return (
    account && (
      <AccountStyled>
        <AccountAddress
          title="Copy address"
          isActive={false}
          onClick={async () => {
            await navigator.clipboard.writeText(account);
            toast.dark("Address copied to clipboard!");
          }}
        >
          {shortenAddress(account)}
        </AccountAddress>
        <AccountDisconnect title="Disconnect wallet" onClick={handleDisconnect}>
          <AiOutlineDisconnect />
        </AccountDisconnect>
      </AccountStyled>
    )
  );
}
