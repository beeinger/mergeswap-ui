import styled from "@emotion/styled";

export const StyledChainSwitcher = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);

  font-family: "Inter", sans-serif;
  font-weight: 500;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  background: grey;
  border-radius: 100000px;
  padding: 1px;
`;

export const Option = styled.div<{ isActive: boolean }>`
  background: ${({ isActive }) => (isActive ? "black" : "transparent")};
  opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};

  border-radius: 100000px;
  padding: 10px 16px;

  cursor: ${({ isActive }) => (isActive ? "default" : "pointer")};
  :hover {
    opacity: ${({ isActive }) => (isActive ? 1 : 0.75)};
  }
`;

export const Center = styled.div<{ onClick: any }>`
  border-radius: 100000px;
  padding: 10px 16px;

  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  background: ${({ onClick }) => (onClick ? "black" : "transparent")};

  :hover {
    opacity: ${({ onClick }) => (onClick ? 0.75 : 1)};
  }
  :active {
    opacity: ${({ onClick }) => (onClick ? 0.65 : 1)};
  }
`;
