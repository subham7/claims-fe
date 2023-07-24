import React from "react";
import cn from "classnames";
import styles from "./Typography.module.scss";

const variantsMapping = {
  heading_lg: "h1",
  heading_md: "h2",
  heading_sm: "h3",
  heading_xs: "h4",
  subheading: "h6",
  body_lg: "p",
  body_md: "p",
  body_sm: "p",
  input_heading: "h4",
  input_desc: "p",
  input_placeholder: "p",
};

const Typography = ({
  variant = "body_md",
  color = "primary",
  children,
  ...props
}) => {
  const Tag = variant ? variantsMapping[variant] : "p";

  const classNames = cn({
    [styles[`typography-variant-${variant}`]]: variant,
    [styles[`typography-color-${color}`]]: color,
  });

  return (
    <Tag className={classNames} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;
