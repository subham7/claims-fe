import React from "react";
import { useRouter } from "next/router";
import Layout1 from "@components/layouts/layout1";
import Members from "@components/members/Members";

const MembersPage = () => {
  const router = useRouter();

  const [daoAddress] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout1 daoAddress={daoAddress} page={3}>
      <Members daoAddress={daoAddress} />
    </Layout1>
  );
};

export default MembersPage;
