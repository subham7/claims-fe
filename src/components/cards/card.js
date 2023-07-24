import { Button, Typography } from "@components/ui";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "30px 40px",
    borderRadius: "20px",
    width: "481px",
    background: "#142243",
    cursor: "pointer",
    height: "fit-content",
    alignItems: "flex-start",
    justifyContent: "space-around",
    minHeight: "300px",
  },
  img: {
    objectFit: "contain",
  },
});

const NewCard = ({ title, subtitle, onClick, buttonText }) => {
  const classes = useStyles();

  return (
    <div className={classes.card}>
      <Typography variant="heading">{title}</Typography>
      <Typography variant="body">{subtitle}</Typography>
      <Button onClick={onClick}>{buttonText}</Button>
    </div>
  );
};

export default NewCard;
