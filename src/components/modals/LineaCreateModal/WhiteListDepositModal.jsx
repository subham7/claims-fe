import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const WhiteListModal = ({ onClose }) => {
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
            Whitelist who can deposit
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p className={classes.subtext}>
          1. Go to activity & click on &quot;Propose&quot;
        </p>

        <Image
          src={"/assets/campaign/proposeButton.png"}
          width={700}
          height={80}
          alt="propose"
        />

        <p
          style={{
            margin: "20px 0",
          }}
          className={classes.subtext}>
          2. Click on &quot;Whitelist custom addresses&quot;
        </p>

        <Image
          src={"/assets/campaign/whitelist.png"}
          width={600}
          height={350}
          alt="whitelist"
        />

        <p
          style={{
            marginTop: "20px",
          }}
          className={classes.subtext}>
          3. Add proposal title, description, deadline & upload a csv with the
          address(es) that you want to whitelist
        </p>

        <Image
          style={{
            marginTop: "20px",
          }}
          src={"/assets/campaign/whitelistForm.png"}
          width={600}
          height={500}
          alt="whitelist"
        />

        <p className={classes.subtext}>
          Sign (multiple signs in case of higher threshold) & execute the action
        </p>
      </div>
    </Modal>
  );
};

export default WhiteListModal;
