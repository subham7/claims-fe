import React from "react";
import styles from "./Button.module.scss";

const Button = ({ variant = "pill", children, onClick, disabled = false }) => {
  let buttonStyles = `${styles.button} ${styles[variant]} ${
    disabled && styles.disabled
  }`;

  const handleClick = () => {
    onClick();
  };

  return (
    <button className={buttonStyles} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
