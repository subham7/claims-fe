import CreateDrop from "@components/createDropsComps/CreateDrop";
import Layout from "@components/layouts/layout";
import React from "react";

const test = () => {
  return (
    <Layout showSidebar={false}>
      <CreateDrop />
    </Layout>
  );
};

export default test;
