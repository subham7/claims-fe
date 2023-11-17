import React from "react";
import { Dialog, DialogContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IoMdClose } from "react-icons/io";
import { PROPOSAL_MENU_ITEMS } from "utils/proposalConstants";
import Router from "next/router";

const useStyles = makeStyles({
  modalStyle: {
    width: "95vw",
    backgroundColor: "#151515",
  },
  dialogBox: {
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
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
  },
});

const SelectActionDialog = ({ open, onClose, daoAddress, networkId }) => {
  const classes = useStyles();

  const onProposalClick = (key) => {
    Router.push({
      pathname:
        window.location.origin + `/proposals/${daoAddress}/${networkId}/new`,
      query: { executionId: key },
    });
  };

  const proposalMenuItems = (filterVal) => {
    return PROPOSAL_MENU_ITEMS()
      .filter((item) => item.section === filterVal)
      .map((item, index) => {
        return (
          <div
            onClick={() => onProposalClick(item.key)}
            className={classes.proposal}
            key={item.text}>
            {item.text}
          </div>
        );
      });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        scroll="body"
        PaperProps={{ classes: { root: classes.modalStyle } }}
        fullWidth
        maxWidth="lg">
        <DialogContent
          sx={{
            overflow: "hidden",
            backgroundColor: "#0F0F0F",
            padding: "2rem",
          }}>
          <div className={classes.header}>
            <Typography variant="h4" className={classes.dialogBox}>
              Select Action
            </Typography>
            <IoMdClose onClick={onClose} className={classes.icon} size={24} />
          </div>
          <div className={classes.list}>
            <Typography variant="h5">Survey</Typography>
            <div className={classes.section}>
              <div
                onClick={() => onProposalClick("survey")}
                className={classes.proposal}
                key="survey">
                Create a Survey
              </div>
            </div>
            <Typography variant="h5">Manage Assets</Typography>
            <div className={classes.section}>
              {proposalMenuItems("Manage Assets")}
            </div>
            <Typography variant="h5">DeFi Pools</Typography>
            <div className={classes.section}>
              {proposalMenuItems("DeFi Pools")}
            </div>
            <Typography variant="h5">Deposits</Typography>
            <div className={classes.section}>
              {proposalMenuItems("Deposits")}
            </div>
            <Typography variant="h5">Administrative</Typography>
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
