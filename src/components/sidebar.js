import React from "react"
import PropTypes from "prop-types"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import MailIcon from "@mui/icons-material/Mail"
import {
  Drawer,
  Box,
  Toolbar,
  ListItemText,
  ListItemIcon,
  ListItem,
  Divider,
  List,
} from "@mui/material"

const drawerWidth = 240

const drawer = (
  <>
    <Toolbar />

    <List>
      {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
        <ListItem button key={text}>
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
    <Divider />
    <List>
      {["All mail", "Trash", "Spam"].map((text, index) => (
        <ListItem button key={text}>
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  </>
)

export default function Sidebar(props) {
  const { window } = props
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      {/* Phone drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={props.mobileOpen}
        onClose={props.handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: (theme) =>
              theme.palette.mode == "dark" ? "#191919" : "#F4F4F5",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* PC drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
            backgroundColor: (theme) =>
              theme.palette.mode == "dark" ? "#191919" : "#F4F4F5",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

Sidebar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
}
