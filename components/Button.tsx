import styled from "@emotion/styled";

const Button = styled.button`
  text-transform: capitalize;
  cursor: pointer;
  user-select: none;

  border: none;
  border-radius: 100000px;
  padding: 8px 16px;

  color: white;
  background-color: black;
  background-image: linear-gradient(
    -45deg,
    #ee765270,
    #e73c7e70,
    #23a5d570,
    #23d5ab70
  );
  background-size: 400% 400%;
  animation: gradient 30s ease infinite;

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :hover:not([disabled]) {
    background-image: linear-gradient(
      -45deg,
      #ee765285,
      #e73c7e85,
      #23a5d585,
      #23d5ab85
    );
  }
  :active:not([disabled]) {
    background-image: linear-gradient(
      -45deg,
      #ee7652,
      #e73c7e,
      #23a5d5,
      #23d5ab
    );
  }
`;
export default Button;
