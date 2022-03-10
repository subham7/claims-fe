import * as React from "react"
import { Box } from "@mui/material"
import { makeStyles } from "@mui/styles"

import Navbar from "../navbar"
import Sidebar from "../sidebar"

export default function ClippedDrawer() {
  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Box></Box>
        <Box></Box>
      </Box>
    </>
  )
}
