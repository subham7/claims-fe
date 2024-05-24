import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const TokenGateModal = ({ onClose }) => {
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
            Tokengate deposits of the station
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p className={classes.subtext}>
          1. Go to deposits tab on settings → ‘Tokengating’
        </p>

        <p className={classes.subtext}>
          2. Simply add in the contract address of the token/NFT you want to
          gate with, enter the minimum no. of tokens to be held & hit “save”.
        </p>

        <Image
          style={{
            marginTop: "20px",
          }}
          src={"/assets/campaign/editTokengate.png"}
          width={700}
          height={280}
          alt="tokengate"
        />

        <p className={classes.subtext}>
          3. Use the AND/OR conditions to configure rules between multiple
          tokens
        </p>
      </div>
    </Modal>
  );
};

export default TokenGateModal;
