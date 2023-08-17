import React from "react";
import classnames from "classnames";
import styles from "./Typography.module.scss";

const variantsMapping = {
  heading: "h1",
  subheading: "h3",
  body: "div",
  info: "div",
};

const Typography = ({ variant = "body", children, className, ...props }) => {
  const Tag = variant ? variantsMapping[variant] : "p";

  const classNames = classnames({
    [styles[`typography-variant-${variant}`]]: variant,
    ["text-primary"]: true /* default color */,
    [className]: className,
  });

  return (
    <Tag className={classNames} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;
