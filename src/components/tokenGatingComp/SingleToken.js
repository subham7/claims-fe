import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  container: {
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "10px",
    border: "0.3px solid #6475A3",
    borderRadius: "8px",
    color: "#fff",
  },
});

const SingleToken = ({ tokenSymbol, tokenAmount, tokenAddress }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <p>{tokenAmount}</p>
      <p>${tokenSymbol}</p>
    </div>
  );
};

export default SingleToken;
