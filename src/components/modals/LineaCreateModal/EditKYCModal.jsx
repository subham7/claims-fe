import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const EditKYCModal = ({ onClose }) => {
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
            Manage KYC of members
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p
          style={{
            marginBottom: "20px",
            color: "#707070",
          }}
          className={classes.subtext}>
          Stations are permissionless but, also allow you to accept
          contributions after KYCing members.
        </p>

        <p className={classes.subtext}>1. KYC on StationX is powered by zkMe</p>

        <p className={classes.subtext}>
          2. Click Manage beside KYC on the settings page & enable the toggle.
        </p>

        <Image
          src={"/assets/campaign/editKYC.png"}
          width={700}
          height={150}
          alt="editKYC"
        />

        <p className={classes.subtext}>
          3. Prompted to create an account on zkMe, click on the link and follow
          (DM t.me/toshitsom) to get this fast-tracked!
        </p>

        <p
          style={{
            margin: "20px 0",
          }}
          className={classes.subtext}>
          4. After zkMe account setup, enter App ID & API key on dialogue box
          and submit!
        </p>

        <Image
          src={"/assets/campaign/editKYC2.png"}
          width={400}
          height={350}
          alt="editKYC"
        />

        <p
          style={{
            margin: "20px 0",
          }}
          className={classes.subtext}>
          Note : Enabling KYC would prompt users to complete KYC on the deposit
          page before making a deposit.
        </p>
      </div>
    </Modal>
  );
};

export default EditKYCModal;
