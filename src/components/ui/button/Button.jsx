import React from "react";
import styles from "./Button.module.scss";
// import classNames from "classnames";
import { Button } from "@mui/material";

const CustomButton = ({
  variant = "pill",
  children,
  onClick,
  disabled = false,
  type = "button",
  className,
}) => {
  let buttonStyles = `${styles.button} ${styles[variant]} ${
    disabled && styles.disabled
  }`;

  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <Button
      type={type}
      variant="contained"
      className={className}
      onClick={handleClick}
      disabled={disabled}>
      {children}
    </Button>
  );
};

export default CustomButton;
