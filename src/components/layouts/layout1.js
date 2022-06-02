import * as React from "react"
import { Box, CssBaseline } from "@mui/material"


import Navbar from "../navbar2"
import Sidebar from "../sidebar"

const drawerWidth = 50

export default function Layout1(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      <Navbar handleDrawerToggle={handleDrawerToggle} page={props.page} />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          page={props.page}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <div style={{ padding: "15px 50px" }}>{props.children}</div>
        </Box>
      </Box>
    </>
  )
}
