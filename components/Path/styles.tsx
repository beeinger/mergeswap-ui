import Button from "components/Button";
import { motion } from "framer-motion";
import styled from "@emotion/styled";

export const StyledPath = styled(({ isInfo, ...rest }) => (
  <motion.div {...rest} />
))<{ isInfo?: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr ${({ isInfo }) => (isInfo ? "0px" : "1.3fr")};
  ${({ isInfo }) => !isInfo && "grid-gap: 8px;"}

  position: relative;

  text-align: center;
  justify-content: space-between;

  padding-top: 16px;
  min-height: 200px;
  min-width: 25vw;
  width: 350px;
  max-width: 500px;

  @media (max-width: 520px) {
    max-width: 98vw;
  }

  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.02);

  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
    rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
`;

export const Title = styled(motion.div)`
  margin: -1px;
  margin-top: -17px;

  border-radius: 16px;
  background: #191b1f;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
`;

export const InteractionContainer = styled.div`
  position: relative;
`;

export const EthInput = styled.input`
  height: 100%;
  margin: 0;
  border: none;

  padding: 0 10%;
  width: calc(100% - 2 * 10%);

  font-size: 2rem;
  color: white;

  background: transparent;

  :focus-visible {
    outline: none;
  }
`;
export const Balance = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
`;
export const MaxButton = styled(Button)`
  padding: 2px 8px;
  font-size: 0.75rem;
  margin-left: 8px;
`;
export const ConfirmTransaction = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;

  font-size: 1.2rem;
`;
