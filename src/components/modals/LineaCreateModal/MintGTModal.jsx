import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const MintGTModal = ({ onClose }) => {
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
            Mint station’s LP tokens to an address
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
          2. Click on &quot;Mint station tokens&quot;
        </p>

        <Image
          src={"/assets/campaign/mintTokens.png"}
          width={600}
          height={350}
          alt="mintGT"
        />

        <p
          style={{
            marginTop: "20px",
          }}
          className={classes.subtext}>
          3. Add title, description, deadline & upload the csv with the
          address(es) with amount(s) that you want to mint
        </p>

        <Image
          style={{
            marginTop: "20px",
          }}
          src={"/assets/campaign/whitelistForm.png"}
          width={600}
          height={500}
          alt="mintGTForm"
        />

        <p className={classes.subtext}>
          Sign (multiple signs in case of higher threshold) & execute the action
        </p>
      </div>
    </Modal>
  );
};

export default MintGTModal;
