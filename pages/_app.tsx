import { Config, DAppProvider, Goerli } from "@usedapp/core";

import Account from "components/Account";
import { CacheProvider } from "@emotion/react";
import React, { useEffect } from "react";
import createCache from "@emotion/cache";
import { providers } from "ethers";
import { globalStyles } from "shared/styles";

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
      <Account />
      <Component {...pageProps} />
    </DAppProvider>
  </CacheProvider>
);

export default App;
