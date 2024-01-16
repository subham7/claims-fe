import { Button, Typography } from "@mui/material";
import React from "react";
import classes from "./InviteModal.module.scss";
import BackdropLoader from "@components/common/BackdropLoader";
import { useDispatch } from "react-redux";
import { setAlertData } from "redux/reducers/alert";

const InviteModal = ({ daoAddress, networkId, onClose }) => {
  const dispatch = useDispatch();

  const copyHandler = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/join/${daoAddress}/${networkId}`,
    );
    dispatch(
      setAlertData({
        open: true,
        message: "Copied!",
        severity: "success",
      }),
    );
  };

  return (
    <>
      <BackdropLoader isOpen={true} showLoading={false} />
      <div className={classes.modal}>
        <Typography variant="inherit" fontSize={25} fontWeight={600} mb={1}>
          Invite Members
        </Typography>

        <Typography variant="inherit" mb={4}>
          Only people with the invite link can join this station by minting
          their membership token(s).
        </Typography>

        <div className={classes.buttons}>
          <Button
            onClick={copyHandler}
            sx={{
              width: "120px",
            }}
            variant="outlined">
            Copy Link
          </Button>
          <Button
            onClick={onClose}
            sx={{
              width: "120px",
            }}
            variant="contained">
            Done
          </Button>
        </div>
      </div>
    </>
  );
};

export default InviteModal;
