import React, { useContext, useMemo } from "react";
import { StyledPath, Title } from "./styles";
import usePath, { PathContext } from "shared/usePath";

import { ChainsContext } from "shared/useChains";
import NoPathChosenYet from "components/NoPathChosenYet";
import PathSwitcher from "components/PathSwitcher";
import PoSToPoW from "components/PoSToPoW";
import PoWToPoS from "components/PoWToPoS";

export default function Path() {
  const { isPoS, isPoW } = useContext(ChainsContext);
  const pathContext = usePath(),
    { path } = pathContext;

  const title = useMemo(() => {
    if (path === "PoW->PoS") {
      if (isPoW) return "Deposit ETH PoW";
      else return "Mint ETH PoW on PoS";
    } else {
      if (isPoS)
        return (
          <>
            Withdraw ETH PoW on PoS
            <br />
            back to PoW
          </>
        );
      else return "Redeem ETH PoW you've withdrawn from PoS";
    }
  }, [isPoS, isPoW, path]);

  return (
    <PathContext.Provider value={pathContext}>
      <StyledPath
        className="styledPath"
        isInfo={path !== "PoW->PoS" && path !== "PoS->PoW"}
      >
        <PathSwitcher />
        <Title layout style={{ borderRadius: 16 }}>
          {path !== "PoW->PoS" && path !== "PoS->PoW" ? (
            <NoPathChosenYet />
          ) : (
            <h2>{title}</h2>
          )}
        </Title>
        {path === "PoW->PoS" ? (
          <PoWToPoS />
        ) : path === "PoS->PoW" ? (
          <PoSToPoW />
        ) : (
          false
        )}
      </StyledPath>
    </PathContext.Provider>
  );
}
