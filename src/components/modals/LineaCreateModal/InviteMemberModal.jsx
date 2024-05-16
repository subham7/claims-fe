import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import { Typography } from "@mui/material";

const InviteMemberModal = ({ onClose }) => {
  return (
    <Modal className={classes.modal}>
      <div className={classes.campaignModal}>
        <Typography variant="inherit" fontSize={26} fontWeight={900} mb={1}>
          How do I invite members into my station?
        </Typography>
        <IoClose onClick={onClose} cursor={"pointer"} size={20} />
      </div>
    </Modal>
  );
};

export default InviteMemberModal;
