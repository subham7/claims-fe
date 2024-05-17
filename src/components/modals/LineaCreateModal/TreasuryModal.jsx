import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const TreasuryModal = ({ onClose }) => {
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
            Where are funds held? - Station’s treasury address
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p className={classes.subtext}>
          1. Treasury address can be found on Settings page.
        </p>

        <p className={classes.subtext}>
          2. All deposits or assets are stored in underlying SAFE of the
          Station.
        </p>
        <Image
          src={"/assets/campaign/editTreasury.png"}
          width={700}
          height={330}
          alt="treasury"
        />

        <p className={classes.subtext}>
          3. Cases where individuals want to do direct transfer, they should
          send funds to the SAFE address on Stations native chain
        </p>

        <p
          style={{
            color: "#707070",
            marginTop: "20px",
          }}
          className={classes.subtext}>
          Note : Treasuries can also be accessed directly from SAFE’s interface.
        </p>
      </div>
    </Modal>
  );
};

export default TreasuryModal;
