import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Members from "@components/members/Members";

const MembersPage = () => {
  const router = useRouter();

  const [daoAddress] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout daoAddress={daoAddress} page={3}>
      <Members daoAddress={daoAddress} />
    </Layout>
  );
};

export default MembersPage;
