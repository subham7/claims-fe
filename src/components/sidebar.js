import React from "react"
import PropTypes from "prop-types"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { makeStyles } from "@mui/styles"
import {
  Drawer,
  Box,
  Toolbar,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  List,
  Link, Tooltip
} from "@mui/material"
import { tooltipClasses } from '@mui/material/Tooltip';
import { useRouter } from "next/router";
import {styled} from "@mui/material/styles";
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';

const useStyles = makeStyles({
  listItemIcon: {
    margin: 3,
    padding: 10,
    height: "auto",
    maxWidth: 360,
    backgroundColor: "#142243",
    borderRadius: "23px",
    justifyContent: "center",
    alignItems: "center",
  },
  listItemIconSelected: {
    margin: 3,
    padding: 10,
    height: "auto",
    maxWidth: 360,
    backgroundColor: "#3B7AFD",
    borderRadius: "23px",
    justifyContent: "center",
    alignItems: "center",
  },
})

const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }} {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#C1D3FF",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    fontFamily: "Whyte",
    backgroundColor: "#C1D3FF",
    color: "#142243",
    fontSize: theme.typography.pxToRem(15),
    border: '1px solid #dadde9',
  },
}));

const drawerWidth = 100

export default function Sidebar(props) {
  const classes = useStyles()
  const { window, page } = props
  const router = useRouter()
  const { clubId } = router.query
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Box
      component="nav"
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
            border: "none",
            boxSizing: "border-box",
            width: drawerWidth,
            paddingTop: "50px",
            backgroundColor: (theme) =>
              theme.palette.mode == "dark" ? "#142243" : "#F4F4F5",

          },
        }}
      >
        <Toolbar />
        <List>
          <BootstrapTooltip title="Dashboard" placement="left">
            <ListItemButton component="a" onClick={e => { router.push(`/dashboard/${clubId}`, undefined, { shallow: true }) }} alignItems="center">
              <ListItemIcon className={page == 1 ? classes.listItemIconSelected : classes.listItemIcon}>
                <HomeRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Proposals" placement="left">
            <ListItemButton component="a" onClick={e => { router.push(`/dashboard/${clubId}/proposal`, undefined, { shallow: true }) }}>
              <ListItemIcon className={page == 2 ? classes.listItemIconSelected : classes.listItemIcon}>
                <InsertDriveFileRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Members" placement="left">
            <ListItemButton component="a" onClick={e => { router.push(`/dashboard/${clubId}/members`, undefined, { shallow: true }) }}>
              <ListItemIcon className={page == 3 ? classes.listItemIconSelected : classes.listItemIcon}>
                <PeopleRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          {/*<BootstrapTooltip title="Transactions" placement="left">*/}
          {/*  <ListItemButton>*/}
          {/*    <ListItemIcon className={classes.listItemIcon}>*/}
          {/*      <CompareArrowsRoundedIcon />*/}
          {/*    </ListItemIcon>*/}
          {/*  </ListItemButton>*/}
          {/*</BootstrapTooltip>*/}

          <BootstrapTooltip title="Settings" placement="left">
            <ListItemButton component="a" onClick={e => { router.push(`/dashboard/${clubId}/settings`, undefined, { shallow: true }) }}>
              <ListItemIcon className={classes.listItemIcon}>
                <SettingsRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>
        </List>
      </Drawer>

      {/* PC drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            border: "none",
            boxSizing: "border-box",
            width: drawerWidth,
            paddingTop: "50px",
            backgroundColor: (theme) =>
              theme.palette.mode == "dark" ? "#142243" : "#F4F4F5",
          },
        }}
        open
      >
        <Toolbar />

        <List>
          <BootstrapTooltip title="Dashboard" placement="left">
            <ListItemButton component="a" onClick={e => { router.push(`/dashboard/${clubId}`, undefined, { shallow: true }) }} alignItems="center">
              <ListItemIcon className={page == 1 ? classes.listItemIconSelected : classes.listItemIcon}>
                <HomeRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Proposals" placement="left">
            <ListItemButton component="a" onClick={e => { router.push(`/dashboard/${clubId}/proposal`, undefined, { shallow: true }) }}>
              <ListItemIcon className={page == 2 ? classes.listItemIconSelected : classes.listItemIcon}>
                <InsertDriveFileRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Members" placement="left">
            <ListItemButton component="a" onClick={e => { router.push(`/dashboard/${clubId}/members`, undefined, { shallow: true }) }}>
              <ListItemIcon className={page == 3 ? classes.listItemIconSelected : classes.listItemIcon}>
                <PeopleRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          {/*<BootstrapTooltip title="Transactions" placement="left">*/}
          {/*  <ListItemButton >*/}
          {/*    <ListItemIcon className={classes.listItemIcon}>*/}
          {/*      <CompareArrowsRoundedIcon />*/}
          {/*    </ListItemIcon>*/}
          {/*  </ListItemButton>*/}
          {/*</BootstrapTooltip>*/}

          <BootstrapTooltip title="Settings" placement="left">
            <ListItemButton component="a" onClick={e => { router.push(`/dashboard/${clubId}/settings`, undefined, { shallow: true }) }}>
              <ListItemIcon className={page == 5 ? classes.listItemIconSelected : classes.listItemIcon}>
                <SettingsRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>
        </List>
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
