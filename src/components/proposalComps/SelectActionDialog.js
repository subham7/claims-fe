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

const SelectActionDialog = ({
  open,
  onClose,
  daoAddress,
  networkId,
  tokenData,
  nftData,
}) => {
  const classes = useStyles();

  const onProposalClick = (item) => {
    Router.push({
      pathname:
        window.location.origin + `/proposals/${daoAddress}/${networkId}/new`,
      query: { item: JSON.stringify(item), tokenData, nftData },
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
            <Typography variant="h5">Manage Assets</Typography>
            <div className={classes.section}>
              {PROPOSAL_MENU_ITEMS()
                .filter((item) => item.section === "Manage Assets")
                .map((item, index) => {
                  return (
                    <div
                      onClick={() => onProposalClick(item)}
                      className={classes.proposal}
                      key={item.text}>
                      {item.text}
                    </div>
                  );
                })}
            </div>
            <Typography variant="h5">DeFi Pools</Typography>
            <div className={classes.section}>
              {PROPOSAL_MENU_ITEMS()
                .filter((item) => item.section === "DeFi Pools")
                .map((item, index) => {
                  return (
                    <div
                      onClick={() => onProposalClick(item)}
                      className={classes.proposal}
                      key={item.text}>
                      {item.text}
                    </div>
                  );
                })}
            </div>
            <Typography variant="h5">Deposits</Typography>
            <div className={classes.section}>
              {PROPOSAL_MENU_ITEMS()
                .filter((item) => item.section === "Deposits")
                .map((item, index) => {
                  return (
                    <div
                      onClick={() => onProposalClick(item)}
                      className={classes.proposal}
                      key={item.text}>
                      {item.text}
                    </div>
                  );
                })}
            </div>
            <Typography variant="h5">Administrative</Typography>
            <div className={classes.section}>
              {PROPOSAL_MENU_ITEMS()
                .filter((item) => item.section === "Administrative")
                .map((item, index) => {
                  return (
                    <div
                      onClick={() => onProposalClick(item)}
                      className={classes.proposal}
                      key={item.text}>
                      {item.text}
                    </div>
                  );
                })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectActionDialog;
