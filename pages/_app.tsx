import { Config, DAppProvider, Mainnet } from "@usedapp/core";

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
  <DAppProvider config={config}>
    <CacheProvider value={cache}>
      {globalStyles}
      <Account />
      <Component {...pageProps} />
    </CacheProvider>
  </DAppProvider>
);

export default App;
