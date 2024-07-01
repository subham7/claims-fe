import React, { useEffect, useState } from "react";
import classes from "./Staking.module.scss";
import Image from "next/image";
import { Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useChainId } from "wagmi";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import StakingPoolModal from "./StakingPoolModal";
import useAppContractMethods from "hooks/useAppContractMethods";

const StakingPoolCard = ({
  image,
  name,
  info,
  apy,
  stakedToken1Details,
  stakedToken2Details,
  executionIds,
  tags,
  risk,
  isUnstakeDisabled,
  daoAddress,
  pooledValue = 0,
}) => {
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [showUnstakingModal, setShowUnstakingModal] = useState(false);
  const [stakingResult, setStakingResult] = useState(null);
  const [proposalId, setProposalId] = useState("");
  const [ratio, setRatio] = useState();

  const { fetchRatioOfNileEzETH_ETHPool } = useAppContractMethods({
    daoAddress,
  });

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const handleStakingComplete = (result, proposalId = "") => {
    setShowStakingModal(false);
    setStakingResult(result);
    setProposalId(proposalId);
  };

  const router = useRouter();
  const chain = useChainId();
  const networkId = "0x" + chain.toString(16);

  useEffect(() => {
    (async () => {
      const value = await fetchRatioOfNileEzETH_ETHPool();
      setRatio(value);
    })();
  }, [daoAddress, networkId]);

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
              ${pooledValue.toFixed(5)}
            </Typography>
            <Typography
              className={classes.smallFont}
              fontSize={14}
              variant="inherit">
              Pooled
            </Typography>
          </div>
        </div>

        <div className={classes.poolTokensInfoContainer}>
          <div className={classes.poolTokensInfo}>
            <Image
              src={stakedToken1Details.tokenLogo}
              width={20}
              height={20}
              alt={stakedToken1Details.tokenName}
            />
            <Typography variant="inherit" fontSize={14} fontWeight={600}>
              {stakedToken1Details?.stakedAmount}{" "}
              {stakedToken1Details.tokenName}
            </Typography>
          </div>
          <div className={classes.poolTokensInfo2}>
            <Image
              src={stakedToken2Details.tokenLogo}
              width={20}
              height={20}
              alt={stakedToken2Details.tokenName}
            />
            <Typography variant="inherit" fontSize={14} fontWeight={600}>
              {stakedToken2Details?.stakedAmount}{" "}
              {stakedToken2Details.tokenName}
            </Typography>
          </div>
        </div>

        <div className={classes.buttonContainer}>
          <button
            className={(!isAdmin || isUnstakeDisabled) && classes.disabled}
            disabled={!isAdmin || isUnstakeDisabled}
            onClick={() => {
              setShowUnstakingModal(true);
            }}>
            Unstake
          </button>
          <button
            className={!isAdmin && classes.disabled}
            disabled={!isAdmin} // Temporary  disabled as Eigen is stopped
            onClick={() => {
              setShowStakingModal(true);
            }}>
            Stake
          </button>
        </div>
      </div>

      {showStakingModal ? (
        <StakingPoolModal
          image={image}
          name={name}
          type="Stake"
          onClose={() => {
            setShowStakingModal(false);
          }}
          daoAddress={daoAddress}
          executionId={executionIds.Stake}
          onStakingComplete={handleStakingComplete}
          token1Details={stakedToken1Details}
          token2Details={stakedToken2Details}
          ratioValue={ratio}
        />
      ) : null}

      {showUnstakingModal ? (
        <StakingPoolModal
          image={image}
          name={name}
          token={token}
          type="Unstake"
          onClose={() => {
            setShowUnstakingModal(false);
          }}
          daoAddress={daoAddress}
          onStakingComplete={handleStakingComplete}
          executionId={executionIds.Unstake}
          unstakeTokenAddress={unstakeTokenAddress}
          token1Details={stakedToken1Details}
          token2Details={stakedToken2Details}
          ratioValue={ratio}
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
            router.push(`/proposals/${daoAddress}/${networkId}`);
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

export default StakingPoolCard;
