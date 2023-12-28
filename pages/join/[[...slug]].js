import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Join from "@components/join/Join";
import Head from "next/head";

const JoinPage = () => {
  const router = useRouter();

  const [daoAddress, networkId = "0x89"] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Join Station</title>
        <meta
          name="description"
          content="Join this station and become a member to participate and contribute."
        />
        <meta
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
          name="viewport"
        />
        <meta
          property="og:image"
          content="https://app.stationx.network/assets/images/monogram.png"
        />
        <link href="https://app.stationx.network" rel="canonical" />
        <meta content="https://app.stationx.network" property="og:url" />
        <meta content="Join Station" property="og:title" />
        <meta content="Join Station" property="og:site_name" />
        <meta
          property="og:description"
          content="Join this station and become a member to participate and contribute."
        />
      </Head>
      <Layout
        showSidebar={false}
        daoAddress={daoAddress}
        page={4}
        networkId={networkId}>
        <Join daoAddress={daoAddress} />
      </Layout>
    </>
  );
};

export default JoinPage;
