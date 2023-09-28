import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";

import Html from "react-pdf-html";
import { shortAddress } from "utils/helper";

const html = `<style>
  .alt-graph .parent {
    margin-top: 150px;
    padding: 0;
    width: 441px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .alt-graph .parent .child {
    margin-left: 50px;
    position: relative;
  }
  .circle {
    width: 10px;
    height: 10px;
    border: 1px solid grey;
    border-radius: 50%;
    background: white;
  }
  .line {
    height: 1px;
    width: 50px;
    background: grey;
    position: absolute;
    left: 100%;
    top: 50%;
  }
  .rectangle {
    height: 80px;
    background: blue;
    width: 10px;
    position: absolute;
    bottom: 20%;
    left: 10%;
    z-index: -1;
  }
  .my-heading4 {
    background: darkgreen;
    color: white;
  }
  .histogram-wrapper {
    width: 380px;
  } 
  </style>

  `;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 40,
  },

  section: {
    // marginTop: 20,
    // marginBottom: 30,
    textAlign: "center",
  },
  text: {
    display: "inline",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 20,
    left: "20%",
    color: "grey",
  },
  parent: {
    marginTop: 150,
    padding: 0,
    height: 200,
    // display: "block",
    display: "flex",
  },

  child: {
    margin: 0,
    padding: 0,
    display: "block",
    marginLeft: 50,
    position: "relative",
  },
  circle: {
    width: 10,
    height: 10,
    border: "1 solid grey",
    borderRadius: "50%",
    backgroundColor: "white",
  },

  line: {
    height: 1,
    width: 50,
    backgroundColor: "grey",
    position: "absolute",
    left: 2,
    top: 2,
    zIndex: -1,
  },

  rectangle: {
    height: 80,
    backgroundColor: "blue",
    width: 10,
    position: "absolute",
    bottom: "20%",
    left: "0%",
    zIndex: "-1",
  },
  signedDiv: {
    marginTop: "50px",
    fontSize: "14px",
    color: "#1e1e1e60",
  },

  signedView: {
    border: "1px",
    background: "#1e1e1e",
    padding: "4px",
    borderRadius: "10px",
    height: "40px",
  },

  signedAcc: {
    color: "black",
    fontSize: "16px",
    border: "1 solid grey",
    textDecoration: "none",
    display: "block",
    padding: "40px",
    borderRadius: "20px",
    backgroundColor: "lightgray",
  },

  adminDetails: {
    marginTop: "50px",
  },

  eachLine: {
    marginTop: "10px",
    fontSize: "14px",
    letterSpacing: ".6px",
  },

  headerLine: {
    marginTop: "20px",
    marginBottom: "4px",
    fontSize: "14px",
  },

  simpleLine: {
    fontSize: "14px",
    letterSpacing: ".6px",
  },
});

export const PdfFile = ({
  title,
  signedAcc,
  signedHash,
  admin_name,
  LLC_name,
  email,
  location,
  general_purpose,
  member_email,
  member_name,
  admin_sign,
  amount,
}) => {
  return (
    <Document>
      <Page style={styles.page} wrap>
        <Html>{html}</Html>

        <View>
          <View
            style={{
              marginTop: "50px",
            }}>
            <Text
              style={{
                marginBottom: "4px",
                fontSize: "16px",
              }}>
              {LLC_name},{/* {LLC_name} */}
            </Text>
            <Text
              style={{
                fontSize: "14px",
              }}>
              A DELAWARE LIMITED LIABILITY COMPANY
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>
              SUBSCRIPTION DOCUMENTS CHECKLIST
            </Text>
            <Text style={styles.simpleLine}>
              - Complete and sign the Subscription Agreement (including
              additional representation page, if applicable).
            </Text>
            <Text style={styles.simpleLine}>
              - Review and sign the Operating Agreement Signature Page.
            </Text>
            <Text style={styles.simpleLine}>
              - Complete Exhibit A (Subscriber Information), and provide any
              documentation requested therein.
            </Text>
            <Text style={styles.simpleLine}>
              - Complete Exhibit B (Accredited Investor Status), and provide any
              documentation requested therein.
            </Text>
            <Text style={styles.simpleLine}>
              - Complete and sign the applicable IRS Form:
            </Text>
            <Text style={styles.simpleLine}>
              {"     "}- W-9 (for Subscribers who are U.S. persons)
            </Text>
            <Text style={styles.simpleLine}>
              {"     "}- W-8BEN (for Individual Subscribers who are not U.S.
              persons)
            </Text>
            <Text style={styles.simpleLine}>
              The Administrative Member may request additional documents it
              deems as necessary from any Subscriber.
            </Text>
            <Text
              style={{
                fontSize: "14px",
                marginTop: "10px",
                letterSpacing: ".6px",
              }}>
              Scan and email your completed documents to {admin_name} (the
              “Administrative Member”) and RKG Agents, to arrive as soon as
              possible and in any event no later than January 9, 2023. Please
              keep a copy of the executed documents for your records. Documents
              should include applicable supporting documentation, as specified
              in the Subscription Documents. Documents should be sent to:
            </Text>

            <Text style={styles.headerLine}>{LLC_name}</Text>
            <Text style={styles.simpleLine}>Email: {email}</Text>

            <Text style={styles.eachLine}>
              (b) If for any reason the Subscriber would like a paper copy of
              the K-1 after the Subscriber has consented to electronic delivery,
              the Subscriber may submit a request to the Administrative Member.
              Requesting a paper copy of the Subscriber’s K-1 will not be
              treated as a withdrawal of consent.
            </Text>

            <Text style={styles.eachLine}>
              (d) The Vehicle (or the Administrative Member) will cease
              providing statements to the Subscriber electronically if the
              Subscriber provides notice to withdraw consent, if the Subscriber
              ceases to be a Member of the Vehicle, or if regulations change to
              prohibit the form of delivery.
            </Text>
            <Text style={styles.eachLine}>
              (e) If the Subscriber needs to update the Subscriber’s contact
              information that is on file, please email the update to the
              Administrative Member. The Subscriber will be notified if there
              are any changes to the contact information of the Vehicle.
            </Text>
            <Text style={styles.eachLine}>
              (f) The Subscriber’s K-1 may be required to be printed and
              attached to a federal, state, or local income tax return.
            </Text>

            <Text style={styles.eachLine}>
              BY SIGNING THIS AGREEMENT, THE SUBSCRIBER:
            </Text>
            <Text style={styles.eachLine}>
              1. ACKNOWLEDGES THAT ANY MISSTATEMENT MAY RESULT IN A FORCED SALE
              OF SUBSCRIBER’S INTERESTS.{" "}
            </Text>
            <Text style={styles.eachLine}>
              2. AGREES THAT IF THE VEHICLE BELIEVES THAT SUBSCRIBER’S
              REPRESENTATION IN SECTION 2(K) IS NO LONGER CORRECT, THE VEHICLE
              MAY BE OBLIGATED TO FREEZE SUBSCRIBER’S INVESTMENT, DECLINE TO
              MAKE DISTRIBUTIONS OR SEGREGATE THE ASSETS CONSTITUTING
              SUBSCRIBER’S INVESTMENT WITH THE VEHICLE IN ACCORDANCE WITH
              APPLICABLE LAW.
            </Text>
            <Text style={styles.eachLine}>(Signature Follow)</Text>
            <Text style={styles.eachLine}>
              SIGNATURE PAGE TO SUBSCRIPTION AGREEMENT
            </Text>
            <Text style={styles.eachLine}>INDIVIDUALS</Text>
            <Text style={styles.eachLine}>
              IN WITNESS WHEREOF, the Subscriber hereby executes this Agreement
              as of the date set forth below.
            </Text>
            <Text style={styles.eachLine}>Subscription Amount: {amount}</Text>
            <Text style={styles.eachLine}>Subscriber:</Text>
            <Text style={styles.eachLine}>
              {member_name && shortAddress(signedHash, 10)}
            </Text>
            <Text style={styles.eachLine}>(Signature)</Text>
            <Text style={styles.eachLine}>{member_name}</Text>
            <Text style={styles.eachLine}>ACCEPTANCE OF SUBSCRIPTION</Text>
            <Text style={styles.eachLine}>
              (to be filled out only by the Vehicle)
            </Text>
            <Text style={styles.eachLine}>
              By signing below, the Administrative Member and the Vehicle hereby
              accept Subscriber’s Subscription for Interests in the Vehicle with
              a Subscription Amount of 0.5, admit the Subscriber as a Member of
              the Vehicle as of the date set forth below in accordance with the
              terms of the Subscription Agreement and the Operating Agreement,
              and authorize this signature page to be attached to the
              Subscription Agreement related to the Vehicle.
            </Text>
            <Text style={styles.eachLine}>
              {admin_name}, in its capacity as Administrative Member, and for
              and on behalf of {LLC_name}
            </Text>
            <Text style={styles.eachLine}>
              By: {member_name ? admin_sign : shortAddress(signedHash, 10)}
            </Text>
            <Text style={styles.eachLine}>Name: {admin_name}</Text>
            <Text style={styles.eachLine}>Title: Administrative Member</Text>
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

const PDFView = ({
  signedAcc,
  signedHash,
  location,
  email,
  admin_name,
  LLC_name,
  general_purpose,
  member_name,
  member_email,
  amount,
  admin_sign,
}) => {
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);
  if (!client) {
    return null;
  }
  return (
    <>
      <PDFViewer height="80%" width="65%">
        <PdfFile
          admin_sign={admin_sign}
          signedAcc={signedAcc}
          signedHash={signedHash}
          location={location}
          email={email}
          LLC_name={LLC_name}
          general_purpose={general_purpose}
          admin_name={admin_name}
          member_name={member_name}
          member_email={member_email}
          amount={amount}
        />
      </PDFViewer>
    </>
  );
};
export default PDFView;
