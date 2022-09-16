import styled from "@emotion/styled";

export const StyledNoPathChosenYet = styled.div`
  > h2 {
    margin-bottom: 0;
  }

  > span {
    font-size: 0.75rem;
    margin-bottom: 16px;
  }

  padding: 32px 0;

  width: fit-content;
`;

export const ColumnContainer = styled.div`
  display: grid;
  white-space: nowrap;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  ol {
    list-style-type: upper-roman;
    text-align: left;
    width: fit-content;
    margin: 0 auto;

    transform: translateX(-10px);
  }

  li {
    height: 3rem;
  }

  > div {
    cursor: pointer;

    > :not(h3) {
      color: rgba(255, 255, 255, 0.7);
    }
    > h3 {
      color: rgba(255, 255, 255, 0.8);
    }

    :hover > * {
      color: rgba(255, 255, 255, 1);
    }

    padding: 8px;

    :hover {
      border-radius: 16px;
      background: #ffffff02;
      box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
        rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    }
  }
`;

export const SmallText = styled.sup`
  position: relative;
  bottom: 2ex;
  font-weight: 400;
  font-size: 0.5rem;
`;
