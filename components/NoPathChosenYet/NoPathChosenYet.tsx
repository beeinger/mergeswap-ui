import { ColumnContainer, StyledNoPathChosenYet } from "./styles";

import { Path } from "shared/types";
import React from "react";

export default function NoPathChosenYet({
  setPath,
}: {
  setPath: React.Dispatch<React.SetStateAction<Path>>;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) =>
    setPath(e.currentTarget.textContent as Path);

  return (
    <StyledNoPathChosenYet>
      <h2>
        Choose the path
        <br />
        you wish to follow
      </h2>
      <ColumnContainer>
        <div>
          <h3 onClick={handleClick}>{"PoW->PoS"}</h3>
          <ul>
            <li>Explanation here</li>
            <li>...</li>
          </ul>
        </div>
        <div>
          <h3 onClick={handleClick}>{"PoS->PoW"}</h3>
          <ul>
            <li>Explanation here</li>
            <li>...</li>
          </ul>
        </div>
      </ColumnContainer>
    </StyledNoPathChosenYet>
  );
}
