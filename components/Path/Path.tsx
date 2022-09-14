import { InteractionContainer, StyledPath, Title } from "./styles";
import React, { useContext, useMemo } from "react";

import { ChainsContext } from "shared/useChains";
import NoPathChosenYet from "components/NoPathChosenYet";
import PathSwitcher from "components/PathSwitcher";
import PoSToPoW from "components/PoSToPoW";
import PoWToPoS from "components/PoWToPoS";
import { useEthers } from "@usedapp/core";
import usePath from "shared/usePath";

export default function Path() {
  const { isETHAtAll, isPoS, isPoW } = useContext(ChainsContext);
  const { account } = useEthers();
  const [path, setPath] = usePath(!account || !isETHAtAll);

  const title = useMemo(() => {
    if (path === "PoW->PoS") {
      if (isPoW) return "Deposit ETH PoW";
      else return "Mint ETH PoW you&apos;ve sent to PoS";
    } else {
      if (isPoS) return "Exchange ETH PoW tokens on PoS back to ETH PoW";
      else return "Redeem ETH PoW you&apos;ve sent back from PoS";
    }
  }, [isPoS, isPoW, path]);

  return (
    <StyledPath
      className="styledPath"
      isInfo={path !== "PoW->PoS" && path !== "PoS->PoW"}
    >
      <PathSwitcher path={path} setPath={setPath} />
      <Title layout style={{ borderRadius: 16 }}>
        {path !== "PoW->PoS" && path !== "PoS->PoW" ? (
          <NoPathChosenYet setPath={setPath} />
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
  );
}
