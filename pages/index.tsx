import React from "react";
import useChains, { ChainsContext } from "shared/useChains";

import ChainSwitcher from "components/ChainSwitcher";
import Head from "next/head";
import NoPathChosenYet from "components/NoPathChosenYet";
import PathSwitcher from "components/PathSwitcher";
import PoSToPoW from "components/PoSToPoW";
import PoWToPoS from "components/PoWToPoS";
import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import usePath from "shared/usePath";

export default function Index() {
  const chains = useChains();
  const { account } = useEthers();
  const [path, setPath] = usePath(!account || !chains.isETHAtAll);

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
          <Path>
            <PathSwitcher path={path} setPath={setPath} />
            {path === "PoW->PoS" ? (
              <PoWToPoS />
            ) : path === "PoS->PoW" ? (
              <PoSToPoW />
            ) : (
              <NoPathChosenYet setPath={setPath} />
            )}
          </Path>
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

  margin-top: calc(15% + 2rem);

  @media (max-width: 685px) {
    margin-top: calc(40% + 2rem);
  }

  gap: 24px;
`;

const Path = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;

  /* justify-content: center; */
  text-align: center;

  background: #191b1f;
  border-radius: 16px;

  padding: 48px;
  padding-top: 16px;
  min-height: 200px;

  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
    rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
`;
