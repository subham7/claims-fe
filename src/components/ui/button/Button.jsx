import React from "react";
import styles from "./Button.module.scss";

const Button = ({ children, onClick, disabled = false }) => {
  const handleClick = () => {
    if (!disabled) onClick();
  };

  return (
    <div
      className={styles.button + " " + (disabled && styles.disabled)}
      onClick={handleClick}>
      {children}
    </div>
  );
};

export default Button;
