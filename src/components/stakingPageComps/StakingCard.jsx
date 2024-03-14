import StatusModal from "@components/modals/StatusModal/StatusModal";
import { Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNetwork } from "wagmi";
import classes from "./Staking.module.scss";
import StakingModal from "./StakingModal";

const StakingCard = ({
  name,
  image,
  apy,
  staked,
  token,
  daoAddress,
  executionIds,
  unstakeTokenAddress,
  isUnstakeDisabled,
  info,
  tags,
  risk,
}) => {
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [showUnstakingModal, setShowUnstakingModal] = useState(false);
  const [stakingResult, setStakingResult] = useState(null);
  const [proposalId, setProposalId] = useState("");

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const handleStakingComplete = (result, proposalId = "") => {
    setShowStakingModal(false);
    setStakingResult(result);
    setProposalId(proposalId);
  };

  const router = useRouter();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  return (
    <>
      <div className={classes.stakingCard}>
        <div className={classes.tagContainer}>
          <div className={classes.heading}>
            <Image
              style={{
                borderRadius: "50px",
              }}
              src={image}
              height={30}
              width={30}
              alt={name}
            />
            <Typography fontSize={18} fontWeight={500} variant="inherit">
              {name}
            </Typography>
          </div>

          <Tooltip
            sx={{
              "& .MuiTooltip-tooltip": {
                fontSize: "4rem", // Adjust the font size as needed
              },
            }}
            placement="bottom"
            title={info}>
            <Image
              src={"/assets/icons/info2.png"}
              height={20}
              width={20}
              alt="info"
              className={classes.icon}
            />
          </Tooltip>
        </div>

        <div className={classes.taglist}>
          <div
            style={{
              backgroundColor:
                risk === "Low"
                  ? "#0ABB9270"
                  : risk === "Medium"
                  ? "#46370F"
                  : "#d5543870",
            }}
            className={classes.tag}>{`${risk} risk`}</div>
          {tags &&
            tags?.map((tag) => (
              <div key={tag} className={classes.tag}>
                {tag}
              </div>
            ))}
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
              {Number(staked).toFixed(4)}{" "}
              {executionIds.Stake === 49 ? (
                <span
                  style={{
                    cursor: "help",
                  }}>
                  <Tooltip title={"1 USDC = ~48.67 meUSDC"}>meUSDC</Tooltip>
                </span>
              ) : executionIds.Stake === 51 ? (
                "aaveWETH"
              ) : (
                token
              )}
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
            className={isUnstakeDisabled && classes.disabled}
            disabled={isUnstakeDisabled}
            onClick={() => {
              setShowUnstakingModal(true);
            }}>
            Unstake
          </button>
          <button
            className={isUnstakeDisabled && classes.disabled}
            disabled={isUnstakeDisabled} // Temporary  disabled as Eigen is stopped
            onClick={() => {
              setShowStakingModal(true);
            }}>
            Stake
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
          daoAddress={daoAddress}
          executionId={executionIds.Stake}
          onStakingComplete={handleStakingComplete}
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
          daoAddress={daoAddress}
          onStakingComplete={handleStakingComplete}
          executionId={executionIds.Unstake}
          unstakeTokenAddress={unstakeTokenAddress}
        />
      ) : null}

      {stakingResult === "success" ? (
        <StatusModal
          heading={"Hurray! We made it"}
          subheading="Transaction created successfully!"
          isError={false}
          onClose={() => setStakingResult(null)}
          buttonText="View & Sign Transaction"
          onButtonClick={() => {
            router.push(`/proposals/${daoAddress}/${networkId}/${proposalId}`);
          }}
        />
      ) : stakingResult === "failure" ? (
        <StatusModal
          heading={"Something went wrong"}
          subheading="Looks like we hit a bump here, try again?"
          isError={true}
          onClose={() => {
            setStakingResult(null);
          }}
          buttonText="Try Again?"
          onButtonClick={() => {
            setStakingResult(null);
          }}
        />
      ) : null}
    </>
  );
};

export default StakingCard;
