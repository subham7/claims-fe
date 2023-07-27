import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AddCardIcon from "@mui/icons-material/AddCard";
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
import Link from "next/link";
import Image from "next/image";
import Web3 from "web3";
// import { HiDocumentDuplicate } from "react-icons/hi";

const useStyles = makeStyles({
  listItemIcon: {
    margin: 3,
    padding: 10,
    height: "auto",
    maxWidth: 360,
    backgroundColor: "#111D38",
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
    color: "#C1D3FF",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#C1D3FF",
    color: "#142243",
    fontSize: theme.typography.pxToRem(15),
    border: "1px solid #dadde9",
  },
}));

const drawerWidth = 100;

const Sidebar = (props) => {
  const classes = useStyles();
  const { page, showSidebar } = props;
  const router = useRouter();
  const { clubId } = router.query;

  const handleDepositRedirect = () => {
    router.push(`${window.origin}/join/${clubId}`, undefined, {
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
          minHeight: showSidebar ? "100vh" : "fit-content",
          paddingTop: "2rem",
          position: showSidebar ? "inherit" : "fixed",
        }}
        open>
        <Box>
          <Link href={"/"}>
            <Image
              src="/assets/images/monogram.png"
              height="40"
              width="40"
              className={classes.image}
              alt="monogram"
            />
          </Link>
        </Box>

        {showSidebar && (
          <List style={{ marginTop: "72px" }}>
            <BootstrapTooltip title="Dashboard" placement="left">
              <ListItemButton
                component="a"
                onClick={(e) => {
                  router.push(`/dashboard/${clubId}`, undefined, {
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
                    `/dashboard/${Web3.utils.toChecksumAddress(
                      clubId,
                    )}/proposal`,
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
                  router.push(`/dashboard/${clubId}/members`, undefined, {
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

            {/*<BootstrapTooltip title="Transactions" placement="left">*/}
            {/*  <ListItemButton >*/}
            {/*    <ListItemIcon className={classes.listItemIcon}>*/}
            {/*      <CompareArrowsRoundedIcon />*/}
            {/*    </ListItemIcon>*/}
            {/*  </ListItemButton>*/}
            {/*</BootstrapTooltip>*/}

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
                  router.push(`/dashboard/${clubId}/settings`, undefined, {
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

            {/* <BootstrapTooltip title="Documents" placement="left">
              <ListItemButton
                component="a"
                onClick={(e) => {
                  router.push(`/dashboard/${clubId}/documents`, undefined, {
                    shallow: true,
                  });
                }}>
                <ListItemIcon
                  className={
                    page == 6
                      ? classes.listItemIconSelected
                      : classes.listItemIcon
                  }>
                  <HiDocumentDuplicate size={30} />
                </ListItemIcon>
              </ListItemButton>
            </BootstrapTooltip> */}
          </List>
        )}
      </div>
    </Box>
  );
};

export default Sidebar;
