import Button from "../ui/button/Button";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "30px 40px",
    borderRadius: "20px",
    // boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
    // margin: '0 auto',
    width: "481px",
    background: "#142243",
    cursor: "pointer",
    height: "fit-content",
    alignItems: "flex-start",
    minHeight: "300px",
  },
  img: {
    objectFit: "contain",
  },
  title: {
    fontSize: "28px",
    fontWeight: "500",
    color: "white",
    marginBottom: "0",
  },
  subtitle: {
    fontSize: "14px",
    color: "lightgray",
    margin: "2rem 0px ",
  },
});

const NewCard = ({ title, subtitle, onClick, buttonText }) => {
  const classes = useStyles();

  return (
    <div className={classes.card}>
      <h2 className={classes.title}>{title}</h2>
      <p className={classes.subtitle}>{subtitle}</p>
      <Button onClick={onClick}>{buttonText}</Button>
    </div>
  );
};

export default NewCard;
