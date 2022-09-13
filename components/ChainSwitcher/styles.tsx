import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const StyledChainSwitcher = styled.div<{ account?: boolean }>`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);

  ${({ account }) =>
    account &&
    css`
      @media (max-width: 685px) {
        top: 80px;
      }
    `}

  font-family: "Inter", sans-serif;
  font-weight: 500;
  white-space: nowrap;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  background: #191b1f;
  border-radius: 100000px;
  /* border: 1px solid #2f3336; */
  padding: 4px;

  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
    rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
`;

export const Option = styled.div<{ isActive: boolean }>`
  background: ${({ isActive }) => (isActive ? "#212429" : "transparent")};
  opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};

  border-radius: 100000px;
  padding: 10px 16px;

  cursor: ${({ isActive }) => (isActive ? "default" : "pointer")};
  :hover {
    opacity: ${({ isActive }) => (isActive ? 1 : 0.75)};
  }
`;

export const Center = styled.div<{ onClick?: any }>`
  border-radius: 100000px;
  padding: 10px 16px;

  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  background: ${({ onClick }) => (onClick ? "#212429" : "transparent")};

  :hover {
    opacity: ${({ onClick }) => (onClick ? 0.75 : 1)};
  }
  :active {
    opacity: ${({ onClick }) => (onClick ? 0.65 : 1)};
  }
`;
