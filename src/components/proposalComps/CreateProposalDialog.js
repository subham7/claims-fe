import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  dialogBox: {
    fontFamily: "Whyte",
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
});
const CreateProposalDialog = ({ open, onClose }) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="body"
      PaperProps={{ classes: { root: classes.modalStyle } }}
      fullWidth
      maxWidth="lg"
    >
      <DialogContent sx={{ overflow: "hidden", backgroundColor: "#19274B" }}>
        <Grid container>
          <Grid item m={3}>
            <Typography className={classes.dialogBox}>
              Create proposal
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProposalDialog;
