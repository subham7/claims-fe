import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { makeStyles } from "@mui/styles";
import { pdf } from "@react-pdf/renderer";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import {
  createDocument,
  getDocumentsByClubId,
  sentFileByEmail,
} from "api/document";
import { addDocumentList, addLegalDocLink } from "redux/reducers/legal";
import { PdfFile } from "./pdfGenerator";
import LegalEntityModal from "@components/modals/LegalEntityModal";
import { web3InstanceEthereum } from "utils/helper";

const DocumentPDF = dynamic(() => import("./pdfGenerator"), {
  ssr: false,
});

const useStyles = makeStyles({
  btn: {
    border: "none",
    padding: "12px 20px",
    marginBottom: "20px",
    color: "white",
    background: "#2D55FF",
    borderRadius: "6px",
    cursor: "pointer",
  },
  container: {
    height: "90vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  signDiv: {
    display: "flex",
    justifyContent: "space-between",
    width: "65%",
  },
});

const SignDoc = ({ daoAddress, isAdmin, networkId }) => {
  const classes = useStyles();
  const [signedAcc, setSignedAcc] = useState("");
  const [signDoc, setSignDoc] = useState(false);
  const [signedHash, setSignedHash] = useState("");
  const [decryptedDataObj, setDecryptedDataObj] = useState("");
  const [client, setClient] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  let docsList = [];

  const adminFormData = useSelector((state) => {
    return state.legal.adminFormData;
  });

  const membersData = useSelector((state) => {
    return state.legal.membersData;
  });

  const encryptedData = useSelector((state) => {
    return state.legal.encryptedLink;
  });

  // signDocument
  const signDocumentHandler = async () => {
    try {
      const web3 = await web3InstanceEthereum();

      // current account
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      const originalMessage =
        "Proceed to Sign the Subscription Document on StationX.network.";

      // Signed message
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        currentAccount,
        "test password!", // configure your own password here.
      );

      setSignedAcc(currentAccount);
      setSignDoc(true);
      setSignedHash(signedMessage);
    } catch (error) {
      console.log(error);
    }
  };

  // Encrypting admin's data and converting into URL
  const finishHandler = async () => {
    try {
      // Convert data into a JSON string
      const data = JSON.stringify({
        LLC_name: adminFormData.LLC_name,
        admin_name: adminFormData.admin_name,
        email: adminFormData.email,
        location: adminFormData.location,
        general_purpose: adminFormData.general_purpose,
        signedAcc: signedAcc,
        signedMessage: signedHash,
      });

      // Sending Email part
      const props = {
        LLC_name: adminFormData.LLC_name,
        admin_name: adminFormData.admin_name,
        email: adminFormData.email,
        location: adminFormData.location,
        general_purpose: adminFormData.general_purpose,
        signedAcc: signedAcc,
        signedHash: signedHash,
      };

      const GetMyDoc = (props) => <PdfFile {...props} />;

      const blob = await pdf(GetMyDoc(props)).toBlob();
      const file = new File([blob], "document.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", adminFormData.email);

      // ----- API CALL ------
      sentFileByEmail(formData);

      // Encrypt it using crypto-JS
      const encryptUserData = CryptoJS.AES.encrypt(data, "").toString();
      const replacedEncrytedLink = encryptUserData.replaceAll("/", "STATION");
      dispatch(addLegalDocLink(replacedEncrytedLink));

      createDocument({
        daoAddress,
        createdBy: signedAcc,
        fileName: "Legal Doc",
        isPublic: false,
        isSignable: true,
        isTokenForSign: true,
        docIdentifier: replacedEncrytedLink,
      });

      docsList.push({
        createdBy: signedAcc,
        updateDate: new Date().toISOString(),
        docIdentifier: replacedEncrytedLink,
        fileName: "Legal Doc",
      });

      dispatch(addDocumentList(docsList.reverse()));
      router.push(`/documents/${daoAddress}/${networkId}`);
    } catch (error) {
      console.log(error);
    }
  };

  // member signed and finished
  const finishMemberSignHandler = async () => {
    try {
      const props = {
        LLC_name: decryptedDataObj.LLC_name,
        admin_name: decryptedDataObj.admin_name,
        email: decryptedDataObj.email,
        location: decryptedDataObj.location,
        general_purpose: decryptedDataObj.general_purpose,
        member_name: membersData.member_name,
        amount: membersData.amount,
        member_email: membersData.member_email,
        admin_sign: decryptedDataObj.signedAcc,
        signedAcc: signedAcc,
        signedHash: signedHash,
      };

      const GetMyDoc = (props) => <PdfFile {...props} />;

      const blob = await pdf(GetMyDoc(props)).toBlob();
      const file = new File([blob], "document.pdf", {
        type: "application/pdf",
      });

      const adminFormData = new FormData();
      adminFormData.append("file", file);
      adminFormData.append("email", decryptedDataObj.email);

      const memberFormData = new FormData();
      memberFormData.append("file", file);
      memberFormData.append("email", membersData.member_email);

      // ----- API CALL ------
      sentFileByEmail(adminFormData);
      sentFileByEmail(memberFormData);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  // admin data from encrypted URL
  const fetchAdminsData = () => {
    try {
      const newEncryptedLink = encryptedData?.replaceAll("STATION", "/");

      // decrypt url
      if (newEncryptedLink) {
        const bytes = CryptoJS.AES.decrypt(newEncryptedLink, "");
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setDecryptedDataObj(decryptedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    fetchAdminsData();
  }, [encryptedData]);

  useEffect(() => {
    const fetchDocs = async () => {
      const docs = await getDocumentsByClubId(daoAddress);
      docsList.push(...docs);
    };
    fetchDocs();
  });

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.signDiv}>
          <h2 className={classes.title}>Review and Confirm</h2>
          {!signDoc && (
            <button onClick={signDocumentHandler} className={classes.btn}>
              Sign PDF
            </button>
          )}

          {signDoc && isAdmin && (
            <button onClick={finishHandler} className={classes.btn}>
              Finish
            </button>
          )}

          {signDoc && membersData && !isAdmin && (
            <button onClick={finishMemberSignHandler} className={classes.btn}>
              Finish
            </button>
          )}
        </div>

        {decryptedDataObj && !isAdmin ? (
          <DocumentPDF
            signedAcc={signedAcc}
            signedHash={signedHash}
            LLC_name={decryptedDataObj.LLC_name}
            admin_name={decryptedDataObj.admin_name}
            email={decryptedDataObj.email}
            location={decryptedDataObj.location}
            general_purpose={decryptedDataObj.general_purpose}
            member_name={membersData.member_name}
            amount={membersData.amount}
            member_email={membersData.member_email}
            admin_sign={decryptedDataObj.signedAcc}
          />
        ) : (
          <DocumentPDF
            signedAcc={signedAcc}
            signedHash={signedHash}
            LLC_name={adminFormData?.LLC_name}
            admin_name={adminFormData?.admin_name}
            email={adminFormData?.email}
            location={adminFormData?.location}
            general_purpose={adminFormData?.general_purpose}
          />
        )}
      </div>
      {/* <button>
        <PDFDownloadLink
          document={<MyDocument title="personal doc" data={formData || {}} />}
          fileName="formDataabc.pdf"
          style={{
            textDecoration: "none",
            padding: "10px",
            color: "#4a4a4a",
            backgroundColor: "#f2f2f2",
            border: "1px solid #4a4a4a",
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download Pdf"
          }
        </PDFDownloadLink>
        Download
      </button> */}
      {/* <button
        onClick={() => {
          htmltoImage().then((imgSrcArr) => {
            import("./PdfGenerator")
              .then(async (module) => {
                const PdfFile = module.default;
                const doc = (
                  <PdfFile
                    title="Personal Doc"
                    data={formData}
                    srcArr={imgSrcArr}
                  />
                );
                const blob = await pdf(doc).toBlob();
                saveAs(blob, "pdfdoc.pdf");
              })
              .catch((error) => console.log("error====>", error));
          });
        }}
      >
        Download PDF
      </button> */}
      {/* {checkForEmptyFields() && (
        <PDFDownloadLink
          document={<PdfFile data={formData} />}
          fileName="formDataabc.pdf"
          style={{
            textDecoration: "none",
            padding: "10px",
            color: "#4a4a4a",
            backgroundColor: "#f2f2f2",
            border: "1px solid #4a4a4a"
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download Pdf"
          }
        </PDFDownloadLink>
      )} */}
      {/* <LineGraph /> */}

      {showModal && (
        <LegalEntityModal
          networkId={networkId}
          daoAddress={daoAddress}
          isSuccess={true}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default SignDoc;
