import { Option, StyledChainSwitcher } from "components/ChainSwitcher/styles";

import React from "react";
import styled from "@emotion/styled";

export default function PathSwitcher({
  path,
  setPath,
}: {
  path: "PoW->PoS" | "PoS->PoW";
  setPath: React.Dispatch<React.SetStateAction<"PoW->PoS" | "PoS->PoW">>;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) =>
    setPath(e.currentTarget.textContent as "PoW->PoS" | "PoS->PoW");
  return (
    <StyledPathSwitcher>
      <PathOption isActive={"PoW->PoS" === path} onClick={handleClick}>
        {"PoW->PoS"}
      </PathOption>
      <PathOption isActive={"PoS->PoW" === path} onClick={handleClick}>
        {"PoS->PoW"}
      </PathOption>
    </StyledPathSwitcher>
  );
}

const StyledPathSwitcher = styled(StyledChainSwitcher)`
  position: relative;
  width: fit-content;
`;

const PathOption = styled(Option)``;
