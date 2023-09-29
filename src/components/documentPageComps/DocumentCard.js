import CustomAlert from "@components/common/CustomAlert";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { BsLink45Deg } from "react-icons/bs";

const useStyles = makeStyles({
  container: {
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
    border: "1px solid #FFFFFF1A",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "20px",
    color: "white",
    cursor: "pointer",
  },
  topLine: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
    alignItems: "center",
    // fontWeight: '400'
  },

  createdBy: {
    fontWeight: "300",
    margin: 0,
    fontSize: "14px",
    color: "#6475A3",
    // letterSpacing: '0.5px'
  },
  span: {
    color: "#dcdcdc",
    // textDecoration: 'underline'
  },
  icons: {
    padding: 4,
    border: "1px solid #FFFFFF1A",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  title: {
    marginTop: "10px",
    fontSize: "20px",
    fontWeight: "400",
    textAlign: "left",
  },
  para: {
    margin: 0,
    fontSize: "12px",
  },
});

const DocumentCard = ({
  legalDocLink,
  date,
  fileName,
  index,
  createdBy,
  daoAddress,
  networkId,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const classes = useStyles();
  const convertedDate = new Date(date).toLocaleDateString();

  return (
    <div className={classes.container}>
      <div className={classes.topLine}>
        <h4 className={classes.createdBy}>
          Created by{" "}
          <span className={classes.span}>
            {createdBy?.slice(0, 5)}....
            {createdBy?.slice(createdBy?.length - 4)}
          </span>{" "}
          on <span className={classes.span}>{convertedDate}</span>
        </h4>

        <div className={classes.iconContainer}>
          <BsLink45Deg
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(
                `${window.location.origin}/documents/${daoAddress}/${networkId}/sign/${legalDocLink}`,
              );
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
            size={25}
            className={classes.icons}
          />
        </div>
      </div>

      <h2 className={classes.title}>
        <span className={classes.span}>#{index} </span>
        {fileName}
      </h2>

      {isCopied && <CustomAlert alertMessage={"Copied"} severity={true} />}
    </div>
  );
};

export default DocumentCard;
