import Image from "next/image";
import React from "react";
import Layout1 from "../../../../src/components/layouts/layout1";
import settingsImg from "../../../../public/assets/images/settings.png";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { getDocumentsByClubId } from "../../../../src/api/document";

const useStyles = makeStyles({
  container: {
    marginLeft: "100px",
    marginTop: "100px",
    display: "flex",
    gap: "30px",
  },
  leftDiv: {
    flex: "0.75",
    margin: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: "30px",
    fontWeight: "500",
    alignSelf: "flex-start",
    marginTop: "0px",
  },
  createDoc: {
    width: "150px",
    fontFamily: "sans-serif",
    fontSize: "18px",
    border: "none",
    padding: "12px 20px",
    color: "white",
    background: "#3B7AFD",
    borderRadius: "6px",
    cursor: "pointer",
  },
  rightDiv: {
    flex: "0.28",
    background: "#81F5FF",
    borderRadius: "12px",
    padding: "20px 20px 0 20px",
    height: "280px",
  },
  imgContainer: {
    position: "relative",
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
    width: "600px",
    margin: "0 auto",
    textAlign: "center",
    border: "1px solid #FFFFFF1A",
    borderRadius: "10px",
    padding: "10px 30px",
    marginTop: "20px",
  },
  noDoc_heading: {
    fontSize: "18px",
    fontWeight: "400",
  },
  noDoc_para: {
    fontSize: "14px",
    fontWeight: "400",
    color: "lightgray",
  },
});

const Documents = () => {
  const classes = useStyles();
  const router = useRouter();

  const { clubId } = router.query;

  const createDocHandler = () => {
    router.push(`/dashboard/${clubId}/documents/legalEntity`);
  };

  return (
    <Layout1>
      <div className={classes.container}>
        {/* Left Side */}
        <div className={classes.leftDiv}>
          <div className={classes.header}>
            <p className={classes.title}>Documents</p>
            <button onClick={createDocHandler} className={classes.createDoc}>
              Create new
            </button>
          </div>

          <div className={classes.noDocument}>
            <p className={classes.noDoc_heading}>No documents found</p>
            <p className={classes.noDoc_para}>
              Create a legal entity for this Station & invite members to sign
              the doucment by sharing a private link.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className={classes.rightDiv}>
          <h3 className={classes.rightDiv_title}>
            Sign Documents within <br /> your Station
          </h3>
          <div className={classes.imgContainer}>
            <p className={classes.docLink}>Read docs</p>
            <Image
              className={classes.img}
              height={200}
              width={300}
              src={settingsImg}
              alt="Sign docs"
            />
          </div>
        </div>
        <div></div>
      </div>
    </Layout1>
  );
};

export default Documents;
