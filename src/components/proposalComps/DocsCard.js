import { Card, Link, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import React from "react";
import proposalImg from "../../../public/assets/images/proposals.png";

const useStyles = makeStyles({
  proposalInfoCard: {
    background: proposalImg,
    backgroundColor: "#C9CBFF",
  },
  proposalImg: {
    position: "relative",
  },
});

const DocsCard = () => {
  const classes = useStyles();
  return (
    <Card
      className={classes.proposalInfoCard}
      sx={{ padding: 0, position: "relative" }}>
      <Image
        src={proposalImg}
        alt="proposal image"
        className={classes.proposalImg}
      />
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          left: 20,
          top: 40,
          color: "#0F0F0F",
          fontWeight: "normal",
          width: "70%",
        }}>
        Create & execute proposals
      </Typography>
      <Link
        href="/"
        sx={{
          position: "absolute",
          color: "#0F0F0F",
          fontWeight: "normal",
          width: "70%",
          textDecoration: "underline",
          fontSize: "0.875rem",
          left: 20,
          bottom: 10,
        }}>
        Read Docs
      </Link>
    </Card>
  );
};

export default DocsCard;
