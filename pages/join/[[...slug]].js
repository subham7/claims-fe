import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Join from "@components/join/Join";

export const metadata = {
  title: "Join Station",
  description:
    "Join this station and become a member to participate and contribute.",
};

const JoinPage = () => {
  const router = useRouter();

  const [daoAddress, networkId = "0x89"] = router?.query?.slug ?? [];

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
