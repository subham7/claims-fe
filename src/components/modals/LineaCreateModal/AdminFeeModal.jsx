import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const AdminFeeModal = ({ onClose }) => {
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
            Implement upfront fees on deposits
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p
          style={{
            marginBottom: "20px",
            color: "#707070",
          }}
          className={classes.subtext}>
          Stations allow you to charge management fees, commissions, service
          fees etc upfront when a user makes deposit.
        </p>

        <p className={classes.subtext}>
          1. Add a fee by simply going to the settings page from left nav bar.
        </p>

        <p className={classes.subtext}>
          2. Set fees in % and save by signing a transaction.
        </p>

        <Image
          src={"/assets/campaign/editAdminFee.png"}
          width={700}
          height={350}
          alt="adminFee"
        />

        <p className={classes.subtext}>
          Note : A % in fees is deducted from users deposit amount & sent to
          Station creators wallet address.{" "}
        </p>
      </div>
    </Modal>
  );
};

export default AdminFeeModal;
