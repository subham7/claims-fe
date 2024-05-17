import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const ChangeDepositParamsModal = ({ onClose }) => {
  useLockBodyScroll(true);

  return (
    <Modal onClose={onClose} className={classes.modal}>
      <div className={classes.campaignModal}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          <p
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
            Change deposit parameters
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p className={classes.subtext}>
          1. To modify deposit parameters, go to Settings → Deposit tab
        </p>

        <Image
          src={"/assets/campaign/depositParams.png"}
          width={600}
          height={600}
          alt="depositParams"
        />

        <p
          style={{
            margin: "20px 0",
          }}
          className={classes.subtext}>
          2. You’ll find the options to modify:
          <br /> - Station’s token price <br /> - Total Fundraise <br /> -
          Min/Max deposits
        </p>

        <p className={classes.subtext}>
          Sign (multiple signs in case of higher threshold) & execute the action
        </p>
      </div>
    </Modal>
  );
};

export default ChangeDepositParamsModal;
