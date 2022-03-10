import React from "react"
import { AppBar, Box, Toolbar, IconButton, Button } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import Image from "next/image"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles({
  image: {
    height: "30px",
    width: "auto !important",
  },
})

export default function Navbar(props) {
  const classes = useStyles()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        className={classes.root}
        position="fixed"
        sx={{ width: "100%", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Image
              src="/assets/images/logo.png"
              height="30"
              width="154"
              className={classes.image}
            />
          </Box>

          <Button variant="dark">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
