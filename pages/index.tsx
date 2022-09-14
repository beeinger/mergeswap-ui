import useChains, { ChainsContext } from "shared/useChains";

import ChainSwitcher from "components/ChainSwitcher";
import Head from "next/head";
import Path from "components/Path";
import React from "react";
import styled from "@emotion/styled";

export default function Index() {
  const chains = useChains();

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
          <Path />
        </MainContainer>
      </ChainsContext.Provider>
    </>
  );
}

const MainContainer = styled.div`
  display: flex;
  justify-content: center;

  margin-top: calc(15% + 2rem);
  @media (max-width: 685px) {
    margin-top: calc(40% + 2rem);
  }
`;
