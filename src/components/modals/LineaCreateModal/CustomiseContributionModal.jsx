import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const CustomiseContributionModal = ({ onClose }) => {
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
            Customise Station’s contribution page
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p className={classes.subtext}>
          1. Click on “Preview & Edit” (top right on Station’s home)
        </p>

        <Image
          src={"/assets/campaign/previewEdit.png"}
          width={700}
          height={200}
          alt="preview"
        />

        <p className={classes.subtext}>
          2. When you are on the contribution page, click on “Edit”
        </p>

        <Image
          src={"/assets/campaign/editPage.png"}
          width={700}
          height={130}
          alt="edit"
        />

        <p className={classes.subtext}>
          3. Add description, banner & social links for your Station here
        </p>

        <Image
          src={"/assets/campaign/editForm.png"}
          width={700}
          height={850}
          alt="edit"
        />
      </div>
    </Modal>
  );
};

export default CustomiseContributionModal;
