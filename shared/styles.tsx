import { Global, css } from "@emotion/react";

import React from "react";

export const globalStyles = (
  <Global
    styles={css`
      html,
      body {
        padding: 0;
        margin: 0;
        color: white;
        min-height: 100%;

        font-family: "Inter", sans-serif;
        font-weight: 500;
      }

      input,
      button {
        font-family: "Inter", sans-serif;
        font-weight: 500;
      }

      html {
        background-color: black;
        background-image: linear-gradient(
          -45deg,
          #ee765240,
          #e73c7e40,
          #23a5d540,
          #23d5ab40
        );
        background-size: 400% 400%;
        animation: gradient 30s ease infinite;
      }

      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `}
  />
);
