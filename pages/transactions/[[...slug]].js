import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Transactions from "@components/transactions/transactions";

const TransactionsPage = () => {
  const router = useRouter();

  const [daoAddress, networkId = "0x89"] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout daoAddress={daoAddress} networkId={networkId} page={6}>
      <Transactions networkId={networkId} />
    </Layout>
  );
};

export default TransactionsPage;
