import Image from "next/image";
import React, { useEffect, useState } from "react";
import settingsImg from "../../../public/assets/images/settings.png";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { Card, Grid, Link, Typography } from "@mui/material";
import LegalEntityModal from "@components/modals/LegalEntityModal";
import { useSelector } from "react-redux";
import { getDocumentsByClubId } from "api/document";
import DocumentCard from "@components/documentPageComps/DocumentCard";

const useStyles = makeStyles({
  container: {
    display: "flex",
    gap: "30px",
  },
  leftDiv: {
    flex: "0.65",
    margin: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: "46px",
    fontWeight: "500",
    alignSelf: "flex-start",
    marginTop: "0px",
  },
  createDoc: {
    width: "150px",

    fontSize: "16px",
    border: "none",
    padding: "18px 24px",
    color: "white",
    background: "#2D55FF",
    borderRadius: "12px",
    cursor: "pointer",
  },
  rightDiv: {
    flex: "0.35",
  },
  imgContainer: {
    position: "relative",
    width: "100%",
  },
  rightDiv_title: {
    fontSize: "24px",
    fontWeight: "500",
    lineHeight: "30px",
    color: "black",
    margin: 0,
  },
  docLink: {
    position: "absolute",
    bottom: "0px",
    color: "black",
    textDecoration: "underline",
    cursor: "pointer",
  },
  noDocument: {
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
    border: "1px solid #FFFFFF1A",
    borderRadius: "10px",
    padding: "10px 30px",
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  noDoc_heading: {
    fontSize: "18px",
    fontWeight: "400",
  },
  noDoc_para: {
    fontSize: "14px",
    fontWeight: "400",
    color: "lightgray",
    width: "600px",
    textAlign: "center",
  },
  proposalInfoCard: {
    background: settingsImg,
    backgroundColor: "#81f5f4",
  },
  proposalImg: {
    position: "relative",
    height: "300px",
    width: "300px",
  },
});

const Documents = ({ daoAddress }) => {
  const classes = useStyles();
  const router = useRouter();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [documents, setDocuments] = useState([]);

  const encryptedLink = useSelector((state) => {
    return state.legal.legalDocLink;
  });

  const docsList = useSelector((state) => {
    return state.legal.documentList;
  });

  const createDocHandler = () => {
    router.push(`/documents/${daoAddress}/create`);
  };

  // closing legal entity modal
  const closeModalHandler = () => {
    setShowInviteModal(false);
  };

  useEffect(() => {
    if (encryptedLink?.length) {
      setShowInviteModal(true);
    }
  }, [encryptedLink]);

  useEffect(() => {
    const fetchDocs = async () => {
      const docs = await getDocumentsByClubId(daoAddress);
      setDocuments(docs.reverse());
    };
    fetchDocs();
  }, [daoAddress]);

  return (
    <>
      <div className={classes.container}>
        {/* Left Side */}
        <div className={classes.leftDiv}>
          <div className={classes.header}>
            <p className={classes.title}>Documents</p>
            <button onClick={createDocHandler} className={classes.createDoc}>
              Create new
            </button>
          </div>

          {docsList?.length ? (
            <>
              {docsList?.map((document, index) => (
                <DocumentCard
                  key={index}
                  legalDocLink={document.docIdentifier}
                  date={document.updateDate}
                  fileName={document.fileName}
                  index={index + 1}
                  createdBy={document.createdBy}
                  daoAddress={daoAddress}
                />
              ))}
            </>
          ) : documents.length ? (
            <>
              {documents.map((document, index) => (
                <DocumentCard
                  key={index}
                  legalDocLink={document.docIdentifier}
                  date={document.updateDate}
                  fileName={document.fileName}
                  index={index + 1}
                  createdBy={document.createdBy}
                  daoAddress={daoAddress}
                />
              ))}
            </>
          ) : (
            <div className={classes.noDocument}>
              <p className={classes.noDoc_heading}>No documents found</p>
              <p className={classes.noDoc_para}>
                Create a legal entity for this Station & invite members to sign
                the doucment by sharing a private link.
              </p>
            </div>
          )}
        </div>

        {/* Right Side */}

        <div className={classes.rightDiv}>
          <Grid item md={4}>
            <Card
              className={classes.proposalInfoCard}
              sx={{ padding: 0, position: "relative" }}>
              <Image
                src={settingsImg}
                alt="proposal image"
                className={classes.proposalImg}
              />
              <Typography
                variant="h4"
                sx={{
                  position: "absolute",
                  left: 20,
                  top: 30,
                  color: "#111D38",
                  fontWeight: "normal",
                  width: "80%",
                }}>
                Sign documents within your station
              </Typography>
              <Link
                href="/"
                sx={{
                  position: "absolute",
                  color: "#111D38",
                  fontWeight: "normal",
                  width: "70%",
                  textDecoration: "underline",
                  fontSize: "0.875rem",
                  left: 20,
                  bottom: 10,
                }}>
                Read Docs
              </Link>
            </Card>
          </Grid>
        </div>

        {showInviteModal && (
          <LegalEntityModal
            encryptedLink={encryptedLink}
            isInvite={true}
            onClose={closeModalHandler}
            daoAddress={daoAddress}
          />
        )}
      </div>
    </>
  );
};

export default Documents;
