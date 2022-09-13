import { Option, StyledChainSwitcher } from "components/ChainSwitcher/styles";

import styled from "@emotion/styled";

export const StyledPathSwitcher = styled(StyledChainSwitcher)`
  width: fit-content;

  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-75%);

  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 2px 4px,
    rgb(0 0 0 / 4%) 0px 4px 6px, rgb(0 0 0 / 1%) 0px 6px 8px;

  @media (max-width: 685px) {
    top: 0;
  }
`;

export const PathOption = styled(Option)`
  white-space: nowrap;
`;
