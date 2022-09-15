import styled from "@emotion/styled";

export const StyledTooltip = styled.span<{
  isToggled: boolean;
  left?: boolean;
}>`
  position: relative;
  margin-right: 12px;
  cursor: help;
  white-space: nowrap;
  z-index: 0;

  > div:first-of-type {
    display: none;
    white-space: normal;

    > svg {
      width: 60px;
      height: 60px;
      margin-right: 16px;
    }

    position: absolute;
    z-index: 2;
    top: -8px;
    ${({ left }) =>
      left
        ? `
        transform: translateY(-100%) translateX(-80%);
        left: 0;`
        : `
        transform: translateY(-100%) translateX(80%);
        right: 0;`}

    background: #212429;
    border-radius: 16px;
    border: 1px solid #2f3136;
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
      rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;

    width: 250px;
    white-space: pre-wrap;

    justify-content: center;
    align-items: center;
    text-align: center;

    padding: 8px 16px;

    font-size: 0.85rem;
    font-weight: 400;
    color: white;
  }

  ${({ isToggled }) => isToggled && "> div:first-of-type { display: flex; }"}

  :hover {
    color: #ffffff80;
  }

  > svg {
    position: absolute;
    right: 0;
    transform: translateX(100%) translateY(-25%);
    top: 0;

    width: 12px;
    height: 12px;
  }
`;
