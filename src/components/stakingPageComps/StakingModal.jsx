import React, { useEffect, useState } from "react";
import Modal from "@components/common/Modal/Modal";
import { TextField, Typography } from "@mui/material";
import classes from "./Staking.module.scss";
import Image from "next/image";
import { useFormik } from "formik";
import { createProposal } from "api/proposal";
import { useSelector } from "react-redux";
import { getUserTokenData, handleSignMessage } from "utils/helper";
import { useAccount, useNetwork } from "wagmi";
import { getPublicClient } from "utils/viemConfig";
import { getProposalCommands } from "utils/proposalData";
import { getTokensList } from "api/token";
import { CHAIN_CONFIG } from "utils/constants";
import dayjs from "dayjs";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import BackdropLoader from "@components/common/BackdropLoader";
import { stakingValidation } from "@components/createClubComps/ValidationSchemas";

const StakingModal = ({
  image,
  type,
  name,
  token,
  staked,
  onClose,
  daoAddress,
  executionId,
  onStakingComplete,
  unstakeTokenAddress = "",
}) => {
  const [tokenData, setTokenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stakeTokenBalance, setStakeTokenDetails] = useState();

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const fetchLatestBlockNumber = async () => {
    const publicClient = getPublicClient(networkId);
    const block = Number(await publicClient.getBlockNumber());

    return block;
  };

  const fetchTokens = async () => {
    if (daoAddress && gnosisAddress && networkId) {
      const tokensList = await getTokensList(
        CHAIN_CONFIG[networkId].covalentNetworkName,
        gnosisAddress,
      );

      const data = await getUserTokenData(
        tokensList?.data?.items,
        networkId,
        true,
      );

      setTokenData(data?.filter((token) => token.symbol !== null));
    }
  };

  const fetchAvailableTokenDetails = async () => {
    try {
      if (token === "ETH") {
        setStakeTokenDetails(tokenData.find((token) => token.symbol === "ETH"));
      } else if (token === "USDC") {
        setStakeTokenDetails(
          tokenData.find((token) => token.symbol === "USDC"),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAvailableTokenDetails();
  }, [gnosisAddress, tokenData]);

  const formik = useFormik({
    initialValues: {
      stakeTokenAddress:
        token === "USDC"
          ? CHAIN_CONFIG[networkId]?.usdcAddress
          : CHAIN_CONFIG[networkId]?.nativeToken,
      stakeAmount: 0,
      unStakeAmount: 0,
      note: "",
      actionCommand: Number(executionId),
      unstakeTokenAddress: unstakeTokenAddress,
    },
    validationSchema: stakingValidation({
      amount:
        type === "Stake"
          ? convertFromWeiGovernance(
              stakeTokenBalance?.balance,
              stakeTokenBalance?.decimals,
            )
          : staked,
      isRocketPool: executionId === 43 ? true : false,
      isMantlePool: executionId === 45 ? true : false,
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        let commands = await getProposalCommands({
          values,
          tokenData,
          clubData,
          daoAddress,
          networkId,
        });

        const blockNum = await fetchLatestBlockNumber();

        commands = {
          executionId: values.actionCommand,
          ...commands,
          usdcTokenSymbol: "USDC",
          usdcTokenDecimal: 6,
          usdcGovernanceTokenDecimal: 18,
        };

        const payload = {
          clubId: daoAddress,
          name: `${name} - ${type}`,
          createdBy: walletAddress,
          votingDuration: dayjs().add(100, "year").unix(),
          votingOptions: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
          commands: [commands],
          type: "action",
          tokenType,
          daoAddress: daoAddress,
          block: blockNum,
          networkId: networkId,
        };

        const { signature } = await handleSignMessage(
          walletAddress,
          JSON.stringify(payload),
        );

        const request = await createProposal(isGovernanceActive, {
          ...payload,
          description: values.note,
          signature,
        });
        onClose();
        setLoading(false);
        onStakingComplete("success", request.data?.proposalId);
      } catch (error) {
        onClose();
        setLoading(false);
        onStakingComplete("failure");
      }
    },
  });

  useEffect(() => {
    if (daoAddress) {
      fetchTokens();
    }
  }, [daoAddress]);

  const maxHandler = () => {
    if (type === "Stake") {
      formik.setFieldValue(
        "stakeAmount",
        convertFromWeiGovernance(
          stakeTokenBalance?.balance,
          stakeTokenBalance?.decimals,
        ),
      );
    } else {
      formik.setFieldValue("stakeAmount", staked);
    }
  };

  return (
    <>
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
            <TextField
              className={classes.input}
              placeholder="0"
              type={"number"}
              name="stakeAmount"
              id="stakeAmount"
              value={formik.values.stakeAmount}
              onChange={formik.handleChange}
              error={
                formik.touched.stakeAmount && Boolean(formik.errors.stakeAmount)
              }
              helperText={
                formik.touched.stakeAmount && formik.errors.stakeAmount
              }
              sx={{
                "& fieldset": { border: "none" },
                "& .MuiInputBase-root": {
                  backgroundColor: "transparent",
                  fontSize: "24px",
                  fontFamily: "inherit",
                },
                "& ::placeholder": {
                  color: "#707070",
                  opacity: 1,
                },
              }}
            />
            <Typography
              onClick={maxHandler}
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
                {Number(
                  convertFromWeiGovernance(
                    stakeTokenBalance?.balance,
                    stakeTokenBalance?.decimals,
                  ),
                ).toFixed(6)}{" "}
                {stakeTokenBalance?.symbol}
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
                {Number(staked).toFixed(4)} {token}
              </span>{" "}
              is staked in this pool.
            </Typography>
          )}
        </div>

        <div>
          <Typography fontSize={16} fontWeight={500} variant="inherit">
            Note
          </Typography>
          <TextField
            name="note"
            id="note"
            value={formik.values.note}
            onChange={formik.handleChange}
            error={formik.touched.note && Boolean(formik.errors.note)}
            helperText={formik.touched.note && formik.errors.note}
            sx={{
              "& fieldset": { border: "none" },
              "& .MuiInputBase-root": {
                backgroundColor: "transparent",
                fontFamily: "inherit",
              },
            }}
            multiline
            rows={2}
            className={classes.note}
          />
        </div>

        <div className={classes.buttonContainer}>
          <button onClick={onClose} className={classes.cancel}>
            Cancel
          </button>
          <button onClick={formik.handleSubmit} className={classes.stake}>
            {type}
          </button>
        </div>
        <BackdropLoader isOpen={loading} />
      </Modal>
    </>
  );
};

export default StakingModal;
