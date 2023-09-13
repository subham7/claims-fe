import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Documents from "@components/documents/documents";
import SignDoc from "@components/documents/signDoc";
import MembersSign from "@components/documents/membersSign";
import DocumentCreate from "@components/documents/documentCreate";

const DocumentsPage = () => {
  const router = useRouter();

  const [daoAddress, flow, membersSign] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout daoAddress={daoAddress} page={7}>
      {flow === undefined ? (
        <Documents daoAddress={daoAddress} />
      ) : flow === "create" ? (
        <DocumentCreate daoAddress={daoAddress} />
      ) : flow === "sign" &&
        (membersSign === "true" || membersSign === undefined) ? (
        <SignDoc
          daoAddress={daoAddress}
          isAdmin={membersSign === undefined ? false : true}
        />
      ) : (
        <MembersSign daoAddress={daoAddress} membersSign={membersSign} />
      )}
    </Layout>
  );
};

export default DocumentsPage;