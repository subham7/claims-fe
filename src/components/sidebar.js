import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { HiDocumentDuplicate } from "react-icons/hi";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AddCardIcon from "@mui/icons-material/AddCard";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { makeStyles } from "@mui/styles";
import {
  Box,
  ListItemIcon,
  ListItemButton,
  List,
  Tooltip,
} from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import Web3 from "web3";

const useStyles = makeStyles({
  listItemIcon: {
    margin: 3,
    padding: 10,
    height: "auto",
    maxWidth: 360,
    backgroundColor: "#0F0F0F",
    borderRadius: "23px",
    justifyContent: "center",
    alignItems: "center",
  },
  listItemIconSelected: {
    margin: 3,
    padding: 10,
    height: "auto",
    maxWidth: 360,
    backgroundColor: "#2D55FF",
    borderRadius: "23px",
    justifyContent: "center",
    alignItems: "center",
  },
});

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip
    TransitionComponent={Fade}
    TransitionProps={{ timeout: 600 }}
    {...props}
    arrow
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#dcdcdc",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#dcdcdc",
    color: "#151515",
    fontSize: theme.typography.pxToRem(15),
    border: "1px solid #dadde9",
  },
}));

const drawerWidth = 100;

const Sidebar = (props) => {
  const classes = useStyles();
  const { page, daoAddress } = props;
  const router = useRouter();

  const handleDepositRedirect = () => {
    router.push(`${window.origin}/join/${daoAddress}`, undefined, {
      shallow: true,
    });
  };

  return (
    <Box component="nav">
      <div
        style={{
          border: "none",
          boxSizing: "border-box",
          width: drawerWidth,
          paddingTop: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          paddingTop: "2rem",
        }}
        open>
        <List>
          <BootstrapTooltip title="Dashboard" placement="left">
            <ListItemButton
              component="a"
              onClick={(e) => {
                router.push(`/dashboard/${daoAddress}`, undefined, {
                  shallow: true,
                });
              }}
              alignItems="center">
              <ListItemIcon
                className={
                  page == 1
                    ? classes.listItemIconSelected
                    : classes.listItemIcon
                }>
                <HomeRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Proposals" placement="left">
            <ListItemButton
              component="a"
              onClick={(e) => {
                router.push(
                  `/proposals/${Web3.utils.toChecksumAddress(daoAddress)}`,
                  undefined,
                  {
                    shallow: true,
                  },
                );
              }}>
              <ListItemIcon
                className={
                  page == 2
                    ? classes.listItemIconSelected
                    : classes.listItemIcon
                }>
                <InsertDriveFileRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Members" placement="left">
            <ListItemButton
              component="a"
              onClick={(e) => {
                router.push(`/members/${daoAddress}`, undefined, {
                  shallow: true,
                });
              }}>
              <ListItemIcon
                className={
                  page == 3
                    ? classes.listItemIconSelected
                    : classes.listItemIcon
                }>
                <PeopleRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Transactions" placement="left">
            <ListItemButton
              component="a"
              onClick={(e) => {
                router.push(`/transactions/${daoAddress}`, undefined, {
                  shallow: true,
                });
              }}>
              <ListItemIcon
                className={
                  page == 6
                    ? classes.listItemIconSelected
                    : classes.listItemIcon
                }>
                <CompareArrowsIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Deposit" placement="left">
            <ListItemButton component="a" onClick={handleDepositRedirect}>
              <ListItemIcon
                className={
                  page == 4
                    ? classes.listItemIconSelected
                    : classes.listItemIcon
                }>
                <AddCardIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Settings" placement="left">
            <ListItemButton
              component="a"
              onClick={(e) => {
                router.push(`/settings/${daoAddress}`, undefined, {
                  shallow: true,
                });
              }}>
              <ListItemIcon
                className={
                  page == 5
                    ? classes.listItemIconSelected
                    : classes.listItemIcon
                }>
                <SettingsRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>

          <BootstrapTooltip title="Documents" placement="left">
            <ListItemButton
              component="a"
              onClick={(e) => {
                router.push(`/documents/${daoAddress}`, undefined, {
                  shallow: true,
                });
              }}>
              <ListItemIcon
                className={
                  page == 7
                    ? classes.listItemIconSelected
                    : classes.listItemIcon
                }>
                <HiDocumentDuplicate size={30} />
              </ListItemIcon>
            </ListItemButton>
          </BootstrapTooltip>
        </List>
      </div>
    </Box>
  );
};

export default Sidebar;
