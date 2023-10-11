import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Documents from "@components/documents/documents";
import SignDoc from "@components/documents/signDoc";
import MembersSign from "@components/documents/membersSign";
import DocumentCreate from "@components/documents/documentCreate";

const DocumentsPage = () => {
  const router = useRouter();

  const [daoAddress, networkId = "0x89", flow, membersSign] =
    router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout
      showSidebar={flow === "create" || flow === undefined ? true : false}
      daoAddress={daoAddress}
      networkId={networkId}
      page={7}>
      {flow === undefined ? (
        <Documents daoAddress={daoAddress} networkId={networkId} />
      ) : flow === "create" ? (
        <DocumentCreate daoAddress={daoAddress} networkId={networkId} />
      ) : flow === "sign" &&
        (membersSign === "true" || membersSign === undefined) ? (
        <SignDoc
          daoAddress={daoAddress}
          isAdmin={membersSign === undefined ? false : true}
          networkId={networkId}
        />
      ) : (
        <MembersSign
          networkId={networkId}
          daoAddress={daoAddress}
          membersSign={membersSign}
        />
      )}
    </Layout>
  );
};

export default DocumentsPage;
