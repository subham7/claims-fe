import { Card, Typography } from "@mui/material"
import React from "react"
import { makeStyles } from "@mui/styles"
import Image from "next/image"
import Tags from "./tags"

const useStyles = makeStyles({
  card: { marginTop: "50px" },
})

export default function CustomCard(props) {
  const classes = useStyles()

  return <Card className={classes.card}>{props.children}</Card>
}
