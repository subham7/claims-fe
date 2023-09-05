import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Join from "@components/join/Join";

const JoinPage = () => {
  const router = useRouter();

  const [daoAddress, networkId] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout
      showSidebar={false}
      daoAddress={daoAddress}
      page={4}
      networkId={networkId}>
      <Join daoAddress={daoAddress} />
    </Layout>
  );
};

export default JoinPage;
