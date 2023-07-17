import React from "react";
import styles from "./Button.module.scss";

const Button = ({ variant = "pill", children, onClick, disabled = false }) => {
  let buttonStyles =
    styles.button +
    " " +
    (variant === "normal" ? styles.normal : styles.pill) +
    " " +
    (disabled && styles.disabled);

  const handleClick = () => {
    if (!disabled) onClick();
  };

  return (
    <div className={buttonStyles} onClick={handleClick}>
      {children}
    </div>
  );
};

export default Button;
