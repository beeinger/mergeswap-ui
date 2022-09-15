import "react-toastify/dist/ReactToastify.css";

import { Config, DAppProvider } from "@usedapp/core";
import { PoS, PoW } from "shared/chains/custom";

import Account from "components/Account";
import { CacheProvider } from "@emotion/react";
import React from "react";
import { ToastContainer } from "react-toastify";
import createCache from "@emotion/cache";
import { globalStyles } from "shared/styles";

const cache = createCache({ key: "next" }),
  config: Config = {
    readOnlyUrls: {
      [PoW.chainId]: PoW.provider,
      [PoS.chainId]: PoS.provider,
    },
    networks: [PoS, PoW],
    noMetamaskDeactivate: true,
  };

const App = ({ Component, pageProps }) => (
  <CacheProvider value={cache}>
    <DAppProvider config={config}>
      {globalStyles}
      <ToastContainer
        enableMultiContainer
        position="top-center"
        containerId="acceptance"
        style={{ width: "fit-content" }}
      />
      <ToastContainer enableMultiContainer position="top-left" />
      <Account />
      <Component {...pageProps} />
    </DAppProvider>
  </CacheProvider>
);

export default App;
