import "react-toastify/dist/ReactToastify.css";

import { Config, DAppProvider, Goerli } from "@usedapp/core";

import Account from "components/Account";
import { CacheProvider } from "@emotion/react";
import React from "react";
import { ToastContainer } from "react-toastify";
import createCache from "@emotion/cache";
import { globalStyles } from "shared/styles";
import { providers } from "ethers";

const cache = createCache({ key: "next" });
const config: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: new providers.JsonRpcProvider( // Goerli (PoW)
      process.env.NEXT_PUBLIC_POW_HTTP_PROVIDER
    ),
    [80001]: new providers.JsonRpcProvider( // Polygon Mumbai (PoS)
      process.env.NEXT_PUBLIC_POS_HTTP_PROVIDER
    ),
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
