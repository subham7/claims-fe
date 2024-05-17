import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { IoClose } from "react-icons/io5";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const StakeDefiModal = ({ onClose }) => {
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
            Change deposit parameters
          </p>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <p className={classes.subtext}>1. Go to Featured pools</p>

        <iframe
          style={{
            marginTop: "20px",
          }}
          width="700"
          height="400"
          frameBorder="0"
          src="https://www.youtube.com/embed/ixCXd8f9RUw"
          title="Staking on DeFi Protocols via StationX"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>

        <p
          style={{
            margin: "20px 0",
          }}
          className={classes.subtext}>
          2. Choose a pool, select the asset, amount & hit submit. For
          dual-token pools, make sure you have the both assets in treasury.
        </p>

        <p className={classes.subtext}>3. Sign & execute to stake asset(s)</p>

        <p className={classes.subtext}>
          Note: Likewise, hit ‘unstake’ on a pool to unstake asset(s).
        </p>
      </div>
    </Modal>
  );
};

export default StakeDefiModal;
