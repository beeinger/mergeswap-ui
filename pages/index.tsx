import React, { useState } from "react";
import useChains, { ChainsContext } from "shared/useChains";

import ChainSwitcher from "components/ChainSwitcher";
import Head from "next/head";
import PathSwitcher from "components/PathSwitcher";
import PoSToPoW from "components/PoSToPoW";
import PoWToPoS from "components/PoWToPoS";
import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";

export default function Index() {
  const { account } = useEthers();
  const chains = useChains();
  const [path, setPath] = useState<"PoW->PoS" | "PoS->PoW">("PoW->PoS");

  return (
    <>
      <Head>
        {/* <!--  Basic Tags --> */}
        <title>MergeSwap</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="description" content="MergeSwap bla bla bla" />
        <meta name="keywords" content="MergeSwap, ETH, Ethereum, merge" />

        {/* <!--  Essential META Tags --> */}
        <meta property="og:title" content="MergeSwap" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.humanesociety.org/sites/default/files/styles/2000x850/public/2020-07/kitten-510651.jpg?h=f54c7448&itok=lJefJMMQ"
        />
        <meta property="og:url" content="https://mergeswap.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* <!--  Non-Essential, But Recommended --> */}
        <meta property="og:description" content="MergeSwap bla bla bla" />
        <meta property="og:site_name" content="MergeSwap" />
        <meta name="twitter:image:alt" content="bla bla bla" />

        {/* <!--  Non-Essential --> */}
        {/* <meta property="fb:app_id" content="your_app_id" /> */}
        {/* <meta name="twitter:site" content="@your_profile" /> */}
      </Head>
      <ChainsContext.Provider value={chains}>
        <ChainSwitcher />
        <MainContainer>
          {account ? (
            chains.isETHAtAll ? (
              <Path>
                <PathSwitcher path={path} setPath={setPath} />
                {path === "PoW->PoS" ? <PoWToPoS /> : <PoSToPoW />}
              </Path>
            ) : (
              "Switch to PoW or PoS ETH"
            )
          ) : (
            "Connect your wallet"
          )}
        </MainContainer>
      </ChainsContext.Provider>
    </>
  );
}

const MainContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;

  margin-top: 60px;

  gap: 24px;
`;

const Path = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  text-align: center;
`;
