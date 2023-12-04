import React from "react";
import { Dialog, DialogContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IoMdClose } from "react-icons/io";
import { PROPOSAL_MENU_ITEMS } from "utils/proposalConstants";
import Router from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  modalStyle: {
    maxWidth: "100vw",
    backgroundColor: "#151515",
  },
  dialogBox: {
    color: "#FFFFFF",
    opacity: 1,
    fontFamily: "inherit !important",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  icon: {
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    height: "70vh",
    overflowY: "auto",
  },
  section: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    marginTop: "1rem",
    marginBottom: "2rem",
  },
  proposal: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "12px",
    padding: "1rem",
    background: "#151515",
    cursor: "pointer",
    width: "300px",
    gap: "1rem",
    border: "1px solid #151515",
    "&:hover": {
      border: "1px solid #dcdcdc40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  title: {
    fontWeight: "bold !important",
    fontSize: "16px !important",
  },
});

const SelectActionDialog = ({ open, onClose, daoAddress, networkId }) => {
  const classes = useStyles();

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const onProposalClick = (key) => {
    Router.push({
      pathname:
        window.location.origin + `/proposals/${daoAddress}/${networkId}/new`,
      query: { executionId: key },
    });
  };

  const proposalMenuItems = (filterVal) => {
    return PROPOSAL_MENU_ITEMS().filter((item) => item.section === filterVal)
      .length > 0 ? (
      PROPOSAL_MENU_ITEMS(isGovernanceActive, tokenType)
        .filter(
          (item) =>
            item.section === filterVal &&
            item.availableOnNetworkIds.includes(networkId) &&
            (!item.condition ||
              (typeof item.condition === "function" && item.condition())),
        )
        .map((item, index) => {
          return (
            <div
              onClick={() => onProposalClick(item.key)}
              className={classes.proposal}
              key={item.text}>
              <Image src={item.icon} height={20} width={20} alt={item.text} />
              <Typography variant="inherit">{item.text}</Typography>
            </div>
          );
        })
    ) : (
      <>Coming Soon</>
    );
  };

  return (
    <>
      <Dialog
        maxWidth="100vw"
        open={open}
        onClose={onClose}
        scroll="body"
        PaperProps={{ classes: { root: classes.modalStyle } }}>
        <DialogContent
          sx={{
            overflow: "hidden",
            backgroundColor: "#0F0F0F",
            padding: "2rem",
          }}>
          <div className={classes.header}>
            <Typography variant="h5" className={classes.dialogBox}>
              Select Action
            </Typography>
            <IoMdClose onClick={onClose} className={classes.icon} size={24} />
          </div>
          <div className={classes.list}>
            <Typography variant="inherit" className={classes.title}>
              Survey
            </Typography>
            <div className={classes.section}>
              <div
                onClick={() => onProposalClick("survey")}
                className={classes.proposal}
                key="survey">
                <Image
                  src="/assets/icons/Add_icon.svg"
                  height={20}
                  width={20}
                  alt="survey"
                />
                Create a Survey
              </div>
            </div>
            <Typography variant="inherit" className={classes.title}>
              Manage Assets
            </Typography>
            <div className={classes.section}>
              {proposalMenuItems("Manage Assets")}
            </div>
            <Typography variant="inherit" className={classes.title}>
              DeFi Pools
            </Typography>
            <div className={classes.section}>
              {proposalMenuItems("DeFi Pools")}
            </div>
            <Typography variant="inherit" className={classes.title}>
              Deposits
            </Typography>
            <div className={classes.section}>
              {proposalMenuItems("Deposits")}
            </div>
            <Typography variant="inherit" className={classes.title}>
              Administrative
            </Typography>
            <div className={classes.section}>
              {proposalMenuItems("Administrative")}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectActionDialog;
