import "react-toastify/dist/ReactToastify.css";

import { Config, DAppProvider, Mainnet } from "@usedapp/core";
import { ToastContainer, toast } from "react-toastify";

import Account from "components/Account";
import { CacheProvider } from "@emotion/react";
import React from "react";
import createCache from "@emotion/cache";
import { getDefaultProvider } from "ethers";
import { globalStyles } from "shared/styles";

const cache = createCache({ key: "next" });
const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider("mainnet"),
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
