import { Global, css } from "@emotion/react";

import React from "react";

export const globalStyles = (
  <Global
    styles={css`
      html,
      body {
        padding: 0;
        margin: 0;
        background: black;
        color: white;
        min-height: 100%;
      }
    `}
  />
);
