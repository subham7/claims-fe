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
import { editMembersFormData } from "api/deposit";

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

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  // signDocument
  const signDocumentHandler = async () => {
    try {
      const web3 = await web3InstanceEthereum();
      // const web3 = await web3InstanceCustomRPC();

      // current account
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      let originalMessage;

      if (isAdmin) {
        originalMessage = JSON.stringify({
          LLC_name: adminFormData.LLC_name,
          admin_name: adminFormData.admin_name,
          email: adminFormData.email,
          location: adminFormData.location,
          general_purpose: adminFormData.general_purpose,
        });
      } else {
        originalMessage = JSON.stringify({
          LLC_name: decryptedDataObj.LLC_name,
          admin_name: decryptedDataObj.admin_name,
          email: decryptedDataObj.email,
          location: decryptedDataObj.location,
          general_purpose: decryptedDataObj.general_purpose,
          member_name: membersData.member_name,
          member_email: membersData.member_email,
          admin_sign: decryptedDataObj.signedAcc,
          signedAcc: signedAcc,
          signedHash: signedHash,
          member_address: membersData.address,
          member_contactNo: membersData.phone,
          member_nominationName: membersData.nomination_name,
          member_witnessName: membersData.witness_name,
        });
      }

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
        admin_address: signedAcc,
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
        admin_sign: signedHash,
      };

      const GetMyDoc = (props) => <PdfFile {...props} />;

      const blob = await pdf(GetMyDoc(props)).toBlob();
      const file = new File([blob], "document.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", adminFormData.email);
      formData.append(
        "subject",
        `${clubData?.name} - Here's your signed copy of Subscription Agreement.`,
      );
      formData.append(
        "body",
        `
Hello ${adminFormData?.admin_name},

Here's a signed copy of the Subscription Agreement for ${adminFormData?.LLC_name} - ${clubData?.name}. StationX does not store a copy of these agreements, so please download and save it for your records.

Cheers,
StationX`,
      );

      // ----- API CALL ------
      sentFileByEmail(formData);

      // Encrypt it using crypto-JS
      const encryptUserData = CryptoJS.AES.encrypt(data, "").toString();
      const replacedEncrytedLink = encryptUserData.replaceAll("/", "STATION");
      dispatch(addLegalDocLink(replacedEncrytedLink));

      createDocument({
        daoAddress,
        fileName: adminFormData.LLC_name,
        docIdentifier: replacedEncrytedLink,
        isTokenForSign: true,
        isSignable: true,
        isPublic: false,
        createdBy: signedAcc,
        isDocUploaded: "false",
        docLink: "",
      });

      docsList.push({
        createdBy: signedAcc,
        updateDate: new Date().toISOString(),
        docIdentifier: replacedEncrytedLink,
        fileName: adminFormData.LLC_name,
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
        member_email: membersData.member_email,
        admin_sign: decryptedDataObj.signedMessage,
        admin_address: decryptedDataObj.signedAcc,
        signedAcc: signedAcc,
        signedHash: signedHash,
        member_address: membersData.address,
        member_contactNo: membersData.phone,
        member_nominationName: membersData.nomination_name,
        member_witnessName: membersData.witness_name,
      };

      const GetMyDoc = (props) => <PdfFile {...props} />;

      try {
        const res = await editMembersFormData({
          daoAddress,
          userAddress: signedAcc,
          email: membersData.member_email,
          docIdentifier: encryptedData,
          docLink: "",
          signature: signedHash,
          formData: [membersData],
        });
        if (res) {
          const blob = await pdf(GetMyDoc(props)).toBlob();
          const file = new File([blob], "document.pdf", {
            type: "application/pdf",
          });

          const adminFormData = new FormData();
          adminFormData.append("file", file);
          adminFormData.append("email", decryptedDataObj.email);
          adminFormData.append(
            "subject",
            `${clubData?.name} - ${membersData?.member_name} has signed Subscription Agreement.`,
          );
          adminFormData.append(
            "body",
            `
Hello ${decryptedDataObj?.admin_name},

Here's a signed copy of the Subscription Agreement for ${decryptedDataObj?.LLC_name} - ${clubData?.name} for ${membersData?.member_name}. StationX does not store a copy of these agreements, so please download and save it for your records.

Cheers,
StationX`,
          );

          const memberFormData = new FormData();
          memberFormData.append("file", file);
          memberFormData.append("email", membersData.member_email);
          memberFormData.append(
            "subject",
            `${clubData?.name} - Here's your signed copy of Subscription Agreement.`,
          );
          memberFormData.append(
            "body",
            `
Hello ${membersData?.member_name},

Here's a signed copy of the Subscription Agreement for ${decryptedDataObj?.LLC_name} - ${clubData?.name}. StationX does not store a copy of these agreements, so please download and save it for your records.

Cheers,
StationX`,
          );

          // ----- API CALL ------
          sentFileByEmail(adminFormData);
          sentFileByEmail(memberFormData);
          router.push(`/join/${daoAddress}/${networkId}`);
        }
      } catch (error) {
        console.log(error);
      }
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
            LLC_name={decryptedDataObj?.LLC_name}
            admin_name={decryptedDataObj?.admin_name}
            email={decryptedDataObj?.email}
            location={decryptedDataObj?.location}
            general_purpose={decryptedDataObj?.general_purpose}
            member_name={membersData?.member_name}
            member_email={membersData?.member_email}
            admin_sign={decryptedDataObj?.signedMessage}
            admin_address={decryptedDataObj?.admin_address}
            member_address={membersData?.address}
            member_contactNo={membersData?.phone}
            member_nominationName={membersData?.nomination_name}
            member_witnessName={membersData?.witness_name}
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
