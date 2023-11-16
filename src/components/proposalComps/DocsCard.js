import { Card, Link, Typography } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import Image from "next/image";
import React from "react";
import proposalImg from "../../../public/assets/images/proposals.png";

const useStyles = makeStyles((theme) => ({
  proposalInfoCard: {
    background: proposalImg,
    backgroundColor: "#C9CBFF",
  },
  proposalImg: {
    position: "relative",
  },
  typography: {
    position: "absolute",
    left: 20,
    top: 40,
    color: theme.palette.background.default,
    fontWeight: "normal",
    width: "70%",
  },
  link: {
    position: "absolute",
    color: theme.palette.background.default,
    fontWeight: "normal",
    width: "70%",
    textDecoration: "underline",
    fontSize: "0.875rem",
    left: 20,
    bottom: 10,
  },
}));

const DocsCard = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <Card
      className={classes.proposalInfoCard}
      sx={{ padding: 0, position: "relative" }}>
      <Image
        src={proposalImg}
        alt="proposal image"
        className={classes.proposalImg}
      />
      <Typography variant="h4" className={classes.typography}>
        Create & execute proposals
      </Typography>
      <Link
        href="https://stationxnetwork.gitbook.io/docs"
        target={"_blank"}
        className={classes.link}>
        Read Docs
      </Link>
    </Card>
  );
};

export default DocsCard;
