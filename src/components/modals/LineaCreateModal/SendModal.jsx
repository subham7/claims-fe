import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const SendModal = ({ onClose }) => {
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
            How do I send funds from the station?
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p className={classes.subtext}>
          1. Find the Send function on the home screen .
        </p>

        <Image
          src={"/assets/campaign/sendDistribute.png"}
          width={700}
          height={200}
          alt="sendDistribute"
        />

        <p
          style={{
            margin: "20px 0",
          }}
          className={classes.subtext}>
          2. Choose the asset, fill in the amount of tokens & recipient address
        </p>

        <Image
          src={"/assets/campaign/sendModal.png"}
          width={400}
          height={400}
          alt="send"
        />

        <p className={classes.subtext}>
          Sign (multiple signs in case of higher threshold) & execute the action
        </p>
      </div>
    </Modal>
  );
};

export default SendModal;
