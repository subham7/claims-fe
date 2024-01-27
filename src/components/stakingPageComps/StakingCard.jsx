import { Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import classes from "./Staking.module.scss";
import StakingModal from "./StakingModal";

const StakingCard = ({ name, image, apy, staked, token }) => {
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [showUnstakingModal, setShowUnstakingModal] = useState(false);

  return (
    <>
      <div className={classes.stakingCard}>
        <div className={classes.heading}>
          <Image src={image} height={30} width={30} alt={name} />
          <Typography fontSize={18} fontWeight={500} variant="inherit">
            {name}
          </Typography>
        </div>

        <div className={classes.apyContainer}>
          <div>
            <Typography fontWeight={600} variant="inherit">
              {apy}%
            </Typography>
            <Typography
              className={classes.smallFont}
              fontSize={14}
              variant="inherit">
              APY
            </Typography>
          </div>

          <div>
            <Typography fontWeight={600} variant="inherit">
              {staked} {token}
            </Typography>
            <Typography
              className={classes.smallFont}
              fontSize={14}
              variant="inherit">
              Staked
            </Typography>
          </div>
        </div>

        <div className={classes.buttonContainer}>
          <button
            onClick={() => {
              setShowStakingModal(true);
            }}>
            Stake
          </button>
          <button
            onClick={() => {
              setShowUnstakingModal(true);
            }}>
            Unstake
          </button>
        </div>
      </div>

      {showStakingModal ? (
        <StakingModal
          image={image}
          name={name}
          staked={staked}
          token={token}
          type="Stake"
          onClose={() => {
            setShowStakingModal(false);
          }}
        />
      ) : null}

      {showUnstakingModal ? (
        <StakingModal
          image={image}
          name={name}
          staked={staked}
          token={token}
          type="Unstake"
          onClose={() => {
            setShowUnstakingModal(false);
          }}
        />
      ) : null}
    </>
  );
};

export default StakingCard;
