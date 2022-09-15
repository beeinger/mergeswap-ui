import { PathOption, StyledPathSwitcher } from "./styles";
import React, { useContext } from "react";

import { Path } from "shared/types";
import { PathContext } from "shared/usePath";

export default function PathSwitcher() {
  const { path, setPath } = useContext(PathContext);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) =>
    setPath(e.currentTarget.textContent as Path);

  return (
    <StyledPathSwitcher>
      <PathOption
        title="Switch to moving tokens from PoW to PoS"
        isActive={"PoW->PoS" === path}
        onClick={handleClick}
      >
        {"PoW->PoS"}
      </PathOption>
      <PathOption
        title="Read about the app"
        isActive={path !== "PoW->PoS" && path !== "PoS->PoW"}
        onClick={handleClick}
      >
        Info
      </PathOption>
      <PathOption
        title="Switch to moving tokens from PoS to PoW"
        isActive={"PoS->PoW" === path}
        onClick={handleClick}
      >
        {"PoS->PoW"}
      </PathOption>
    </StyledPathSwitcher>
  );
}
