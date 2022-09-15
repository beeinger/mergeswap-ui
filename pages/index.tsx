import useChains, { ChainsContext } from "shared/useChains";

import ChainSwitcher from "components/ChainSwitcher";
import Head from "next/head";
import Logo from "components/Logo";
import Path from "components/Path";
import React from "react";
import styled from "@emotion/styled";

export default function Index() {
  const chains = useChains();

  return (
    <>
      <Head>
        {/* <!--  Basic Tags --> */}
        <title>{"MergeSwap - PoW <> PoS bridge"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="description" content="MergeSwap bla bla bla" />
        <meta name="keywords" content="MergeSwap, ETH, Ethereum, merge" />

        {/* <!--  Essential META Tags --> */}
        <meta
          property="og:title"
          content={`MergeSwap - PoW ${"<>"} PoS bridge`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://mergeswap.xyz/metadata/miniature.png"
        />
        <meta property="og:url" content="https://mergeswap.xyz/" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* <!--  Non-Essential, But Recommended --> */}
        <meta property="og:description" content="Mergewap bla bla bla" />
        <meta property="og:site_name" content="MergeSwap" />
        <meta name="twitter:image:alt" content="bla bla bla" />

        {/* <!-- Favicon & manifest --> */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/metadata/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/metadata/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/metadata/favicon-16x16.png"
        />
        <link rel="manifest" href="/metadata/site.webmanifest" />

        {/* <!--  Non-Essential --> */}
        {/* <meta property="fb:app_id" content="your_app_id" /> */}
        {/* <meta name="twitter:site" content="@your_profile" /> */}
      </Head>
      <ChainsContext.Provider value={chains}>
        <ChainSwitcher />
        <Logo />
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
