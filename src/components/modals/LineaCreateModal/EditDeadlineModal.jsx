import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const EditDeadlineMdoal = ({ onClose }) => {
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
            Increase or decrease contribution deadline
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p
          style={{
            marginBottom: "20px",
            color: "#707070",
          }}
          className={classes.subtext}>
          Contribution deadline represents the date beyond which people can not
          join your Station.
        </p>

        <p className={classes.subtext}>
          1. To change deposit deadline, go to settings, click ‘Deposits’ tab.
        </p>

        <Image
          src={"/assets/campaign/editDeadline.png"}
          width={700}
          height={230}
          alt="editDeadline"
        />

        <p
          style={{
            margin: "20px 0",
          }}
          className={classes.subtext}>
          2. Set the new deadline for deposits as per your timezone.
        </p>
      </div>
    </Modal>
  );
};

export default EditDeadlineMdoal;
