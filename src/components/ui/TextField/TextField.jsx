import React from "react";
import { TextField as MaterialTextField } from "@mui/material";
import styles from "./TextField.module.scss";

const TextField = (props) => {
  return <MaterialTextField className={styles.textfield} {...props} />;
};

export default TextField;
