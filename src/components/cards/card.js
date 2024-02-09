import { Button } from "@components/ui";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "30px 40px",
    borderRadius: "20px",
    width: "520px",
    background: "#151515",
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
      <Typography mb={-2} fontSize={28} fontWeight={600} variant="heading">
        {title}
      </Typography>
      <Typography color={"gray"} variant="body">
        {subtitle}
      </Typography>
      <Button onClick={onClick}>{buttonText}</Button>
    </div>
  );
};

export default NewCard;
