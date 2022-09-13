import styled from "@emotion/styled";

export const StyledNoPathChosenYet = styled.div``;

export const ColumnContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  ul {
    list-style-type: circle;
    text-align: left;
  }

  h3 {
    :hover {
      opacity: 0.75;
      cursor: pointer;
    }
  }
`;
