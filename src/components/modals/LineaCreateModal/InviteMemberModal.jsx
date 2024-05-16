import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const InviteMemberModal = ({ onClose }) => {
  useLockBodyScroll(true);

  return (
    <Modal className={classes.modal}>
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
            How do I invite members into my station?
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>
        <Image
          src={"/assets/campaign/inviteMember.png"}
          width={700}
          height={200}
          alt="Copy"
        />

        <p className={classes.subtext}>
          To invite members to deposit, simply copy the link & share it with
          your depositors. You can find this section on the right side on the
          dashboard home page.
        </p>
      </div>
    </Modal>
  );
};

export default InviteMemberModal;
