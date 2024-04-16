import Modal from "@components/common/Modal/Modal";
import React from "react";
import classes from "./DepositCardModal.module.scss";
import { PiArrowElbowDownRightBold } from "react-icons/pi";
import UserInfo from "./UserInfo";
import AmountInfo from "./AmountInfo";
import ModalTitle from "./ModalTitle";

const DepositCardModal = ({ onClose, text, submitHandler }) => {
  const iconStyle = { fontWeight: 800, marginRight: "4px" };

  return (
    <Modal className={classes.modal}>
      <ModalTitle onClose={onClose} title="Join this station" />

      <div className={classes.userInputContainer}>
        <UserInfo
          name="Pranav's Syndicate"
          wallet="0x9384...k2342"
          amount="1,023"
        />
      </div>

      <div className={classes.detailsContainer}>
        <AmountInfo
          title="Deposit"
          amount="1000 USDC"
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />
        <AmountInfo
          title="Admin Fee (2%)"
          amount="20 USDC"
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />
        <AmountInfo
          title="StationX Fee"
          amount="0.002 ETH"
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />
      </div>

      <button onClick={submitHandler} className={classes.confirmButton}>
        {text}
      </button>
    </Modal>
  );
};

export default DepositCardModal;
