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
          name="cover"
          property="og:image"
          content="/assets/images/monogram.png"
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
