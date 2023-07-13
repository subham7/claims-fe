import React from "react";
import styles from "./Button.module.scss";

const Button = ({ children, onClick }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div className={styles.button} onClick={handleClick}>
      {children}
    </div>
  );
};

export default Button;
