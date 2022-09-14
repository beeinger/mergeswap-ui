import "react-toastify/dist/ReactToastify.css";

import { Config, DAppProvider, Goerli } from "@usedapp/core";

import Account from "components/Account";
import { CacheProvider } from "@emotion/react";
import React from "react";
import { ToastContainer } from "react-toastify";
import createCache from "@emotion/cache";
import { globalStyles } from "shared/styles";
import { PoS, PoW } from "shared/chains/custom";
import { providers } from "ethers";

const cache = createCache({ key: "next" });
export const config: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [PoW.chainId]: PoW.provider,
    [PoS.chainId]: PoS.provider,
  },
};

const App = ({ Component, pageProps }) => (
  <CacheProvider value={cache}>
    <DAppProvider config={config}>
      {globalStyles}
      <ToastContainer position="top-left" />
      <Account />
      <Component {...pageProps} />
    </DAppProvider>
  </CacheProvider>
);

export default App;
