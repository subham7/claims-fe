import React from "react";
import styles from "./Button.module.scss";

const Button = ({
  variant = "pill",
  children,
  onClick,
  disabled = false,
  type = "button",
}) => {
  let buttonStyles = `${styles.button} ${styles[variant]} ${
    disabled && styles.disabled
  }`;

  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={handleClick}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
