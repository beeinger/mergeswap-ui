import Button from "./Button";
import React from "react";
import styled from "@emotion/styled";

const agreeToContinue = (closeToast, onClose) => (
  <AgreeToContinue>
    This app is using contracts that haven&apos;t been audited,
    <br />
    continuing you agree to do so at your own risk,
    <br />
    all deposited capital might be lost.
    <br />
    <div>
      <Button
        onClick={() => {
          onClose();
          closeToast();
        }}
      >
        Agree
      </Button>
    </div>
  </AgreeToContinue>
);

export default agreeToContinue;

const AgreeToContinue = styled.div`
  max-width: 500px;
  padding: 8px 0;
  padding-right: 16px;
  font-family: "Inter", sans-serif;
  font-size: 1.1rem;

  > div {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
`;
