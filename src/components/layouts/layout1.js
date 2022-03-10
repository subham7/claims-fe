import * as React from "react"
import { Box, CssBaseline } from "@mui/material"

import Navbar from "../navbar"
import Sidebar from "../sidebar"

const drawerWidth = 240

export default function Layout(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      <Navbar handleDrawerToggle={handleDrawerToggle} />

      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Box
          mt={7}
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          {props.children}
        </Box>
      </Box>
    </>
  )
}
