import * as React from "react";
import { Box, CssBaseline } from "@mui/material";

import Navbar from "../navbar";
import Sidebar from "../sidebar";

const drawerWidth = 50;

export default function Layout1(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { showSidebar = true } = props;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Sidebar
          showSidebar={showSidebar}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          page={props.page}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}>
          <div style={{ padding: "12px 32px 0px 40px" }}>{props.children}</div>
        </Box>
      </Box>
    </>
  );
}
