import React from "react";
import Modal from "@components/common/Modal/Modal";
import { Typography } from "@mui/material";
import classes from "./Staking.module.scss";
import Image from "next/image";

const StakingModal = ({ image, type, name, token, staked, onClose }) => {
  return (
    <Modal onClose={onClose} className={classes.modal}>
      <Typography
        className={classes.heading}
        fontSize={18}
        fontWeight={600}
        variant="inherit">
        {type}
      </Typography>

      <div className={classes.nameContainer}>
        <Image src={image} height={35} width={35} alt={name} />
        <Typography fontSize={20} fontWeight={500} variant="inherit">
          {name}
        </Typography>
      </div>

      <div className={classes.stakeContainer}>
        <Typography fontSize={16} fontWeight={500} variant="inherit">
          You {type.toLowerCase()}
        </Typography>
        <div className={classes.inputContainer}>
          <Image
            src={
              token === "USDC"
                ? "/assets/icons/usdc.png"
                : "/assets/icons/eth.png"
            }
            height={22}
            width={22}
            alt={token}
          />
          <input placeholder="0" type={"number"} />
          <Typography
            className={classes.max}
            fontSize={16}
            fontWeight={500}
            variant="inherit">
            Max
          </Typography>
        </div>

        {type === "Stake" ? (
          <Typography
            className={classes.staked}
            fontSize={14}
            fontWeight={500}
            variant="inherit">
            You have{" "}
            <span>
              {staked} {token}
            </span>{" "}
            in your station
          </Typography>
        ) : (
          <Typography
            className={classes.staked}
            fontSize={14}
            fontWeight={500}
            variant="inherit">
            Total of{" "}
            <span>
              {staked} {token}
            </span>{" "}
            is staked in this pool.
          </Typography>
        )}
      </div>

      <div>
        <Typography fontSize={16} fontWeight={500} variant="inherit">
          Note
        </Typography>
        <textarea rows={3} className={classes.note} />
      </div>

      <div className={classes.buttonContainer}>
        <button onClick={onClose} className={classes.cancel}>
          Cancel
        </button>
        <button className={classes.stake}>{type}</button>
      </div>
    </Modal>
  );
};

export default StakingModal;
