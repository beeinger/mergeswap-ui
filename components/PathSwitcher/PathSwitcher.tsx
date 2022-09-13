import { PathOption, StyledPathSwitcher } from "./styles";

import { Path } from "shared/types";
import React from "react";

export default function PathSwitcher({
  path,
  setPath,
}: {
  path: Path;
  setPath: React.Dispatch<React.SetStateAction<Path>>;
}) {
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
        title="Switch to moving tokens from PoS to PoW"
        isActive={"PoS->PoW" === path}
        onClick={handleClick}
      >
        {"PoS->PoW"}
      </PathOption>
    </StyledPathSwitcher>
  );
}
