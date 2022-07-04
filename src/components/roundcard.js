import { Card, Typography } from "@mui/material"
import React from "react"
import { makeStyles } from "@mui/styles"
import Image from "next/image"
import Tags from "./tags"

const useStyles = makeStyles({
  round_card: {
    // add a border radius to the card
    borderRadius: "100%",
    width: "5.99vw",
    height: "11.37vh",
    background: "#C1D3FF1A 0% 0% no-repeat padding-box",
    opacity: "1",
    "&:hover": {
      cursor: "pointer",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default function CustomRoundedCard(props) {
  const classes = useStyles()

  return <Card className={classes.round_card}>{props.children}</Card>
}
