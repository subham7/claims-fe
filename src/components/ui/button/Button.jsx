import React from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

const Button = ({
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
    <button
      type={type}
      className={classNames(buttonStyles, className)}
      onClick={handleClick}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
