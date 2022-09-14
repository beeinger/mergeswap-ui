import { Option, StyledChainSwitcher } from "components/ChainSwitcher/styles";

import styled from "@emotion/styled";

export const StyledPathSwitcher = styled(StyledChainSwitcher)`
  width: fit-content;

  position: absolute;
  z-index: 1;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-70%);

  /* box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 2px 4px,
    rgb(0 0 0 / 4%) 0px 4px 6px, rgb(0 0 0 / 1%) 0px 6px 8px; */
  box-shadow: none;

  @media (max-width: 685px) {
    top: 0;
  }
  border: none;
  /* //? Idk if its better with this or without */
  background-color: black;
  background-image: linear-gradient(
    -45deg,
    #ee765280,
    #e73c7e80,
    #23a5d580,
    #23d5ab80
  );
  background-size: 400% 400%;
  animation: gradient 30s ease infinite;
  /* //? --- */
`;

export const PathOption = styled(Option)`
  white-space: nowrap;
`;
