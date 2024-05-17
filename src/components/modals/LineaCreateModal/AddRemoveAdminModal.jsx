import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const AddRemoveAdminModal = ({ onClose }) => {
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
            Add/remove admins
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p
          style={{
            marginBottom: "20px",
            color: "#707070",
          }}
          className={classes.subtext}>
          You can add/remove admins (aka Signatories) on a Station. Admins are
          wallets having power to sign & execute transactions on a Station based
          on threshold. Similar to how a SAFE multisig works.
        </p>

        <Image
          src={"/assets/campaign/editSigner.png"}
          width={650}
          height={650}
          alt="editSigner"
        />

        <p
          style={{
            margin: "20px 0",
          }}
          className={classes.subtext}>
          You can add/remove admins & set new threshold on the Settings page.
        </p>
      </div>
    </Modal>
  );
};

export default AddRemoveAdminModal;
