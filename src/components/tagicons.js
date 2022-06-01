import { React } from "react"
import { makeStyles } from "@mui/styles"
import { Card } from "@mui/material"

const useStyles = makeStyles({
    tagIcon: {
        borderRadius: "17px",
        width: "98px",
        height: "34px",
        opacity: "1",
        padding: "10px",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
    }
})


export default function TagIcon(props) {
  const classes = useStyles()

  return (
    <Card className={classes.tagIcon} m={0} p={0}>
        {props.children}
    </Card>
  )
}