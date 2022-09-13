import { Center, Option } from "components/ChainSwitcher/styles";

import { StyledChainSwitcher } from "components/ChainSwitcher/styles";
import styled from "@emotion/styled";

export const AccountStyled = styled(StyledChainSwitcher)`
  right: 16px;
  left: auto;
  transform: none;

  @media (max-width: 685px) {
    left: 50%;
    transform: translateX(-50%);
  }

  width: fit-content;
`;

export const AccountAddress = styled(Option)``;

export const AccountDisconnect = styled(Center)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
