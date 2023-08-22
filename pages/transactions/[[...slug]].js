import React from "react";
import { useRouter } from "next/router";
import Layout1 from "@components/layouts/layout1";
import Transactions from "@components/transactions/transactions";

const TransactionsPage = () => {
  const router = useRouter();

  const [daoAddress] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout1 daoAddress={daoAddress} page={6}>
      <Transactions />
    </Layout1>
  );
};

export default TransactionsPage;
