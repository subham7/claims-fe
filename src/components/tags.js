import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#3B7AFD",
    borderRadius: "16px",
    textAlign: "center",
    color: "#fff",
    display: "inline",
    padding: "2px 20px",
    fontSize: "0.8em",
  },
});

export default function Tags(props) {
  const classes = useStyles();

  return <div className={classes.root}>hello</div>;
}
