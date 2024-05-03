import Modal from "@components/common/Modal/Modal";
import { Skeleton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import classes from "./Staking.module.scss";
import Image from "next/image";
import BackdropLoader from "@components/common/BackdropLoader";
import { useFormik } from "formik";
import {
  convertFromWeiGovernance,
  fetchLatestBlockNumber,
} from "utils/globalFunctions";
import dayjs from "dayjs";
import { useAccount, useChainId } from "wagmi";
import { useSelector } from "react-redux";
import { handleSignMessage } from "utils/helper";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { createProposal } from "api/proposal";
import BigNumber from "bignumber.js";
import { stakingPoolValidation } from "@components/createClubComps/ValidationSchemas";

const TokenLoadingShimmer = () => {
  return <Skeleton width={60} height={30} />;
};

const StakingPoolModal = ({
  type,
  image,
  name,
  token1Details,
  token2Details,
  daoAddress,
  executionId,
  onClose,
  onStakingComplete,
  ratioValue,
}) => {
  const [loading, setLoading] = useState(false);
  const [stakeToken1Balance, setStakeToken1Balance] = useState(0);
  const [stakeToken2Balance, setStakeToken2Balance] = useState(0);
  const [isFetchingValue, setIsFetchingValue] = useState(false);

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const { getBalance } = useCommonContractMethods({
    daoAddress,
  });

  const { address: walletAddress } = useAccount();
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const fetchBalances = async () => {
    try {
      setIsFetchingValue(true);
      const token1Balance = await getBalance(
        token1Details?.tokenAddress,
        gnosisAddress,
      );
      const token2Balance = await getBalance(
        token2Details?.tokenAddress,
        gnosisAddress,
      );

      setStakeToken1Balance(
        convertFromWeiGovernance(token1Balance, token1Details?.tokenDecimal),
      );

      setStakeToken2Balance(
        convertFromWeiGovernance(token2Balance, token2Details?.tokenDecimal),
      );
      setIsFetchingValue(false);
    } catch (error) {
      console.log(error);
      setIsFetchingValue(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      token1Amount: 0,
      token2Amount: 0,
      note: "",
      actionCommand: Number(executionId),
    },
    validationSchema: stakingPoolValidation({
      token1Balance: stakeToken1Balance,
      token2Balance: stakeToken2Balance,
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const blockNum = await fetchLatestBlockNumber(networkId);
        const commands = {
          executionId: Number(executionId),
          usdcTokenSymbol: "USDC",
          usdcTokenDecimal: 6,
          usdcGovernanceTokenDecimal: 18,
          stakeToken1Address: token1Details?.tokenAddress,
          stakeToken1Amount: values.token1Amount,
          stakeToken2Address: token2Details?.tokenAddress,
          stakeToken2Amount: values.token2Amount,
        };
        const payload = {
          clubId: daoAddress,
          name: `${name} - ${
            type === "Stake" ? "Add Liquidity" : "Remove Liquidity"
          }`,
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
          description: values.note
            ? values.note
            : `${type === "Stake" ? "Add liquidity" : "Remove Liquidity"} ${
                values.token1Amount
              } ${token1Details?.tokenName} & ${values.token2Amount} ${
                token2Details?.tokenName
              }`,
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
    if (gnosisAddress) fetchBalances();
  }, [networkId, gnosisAddress]);

  const maxToken1Handler = () => {
    const newToken1Amount = BigNumber.minimum(
      BigNumber(stakeToken1Balance),
      BigNumber(stakeToken2Balance).dividedBy(ratioValue),
    );
    const newToken2Amount = newToken1Amount.times(ratioValue);
    formik.setFieldValue("token1Amount", newToken1Amount.toString());
    formik.setFieldValue("token2Amount", newToken2Amount.toString());
  };

  const maxToken2Handler = () => {
    const newToken2Amount = BigNumber.minimum(
      BigNumber(stakeToken2Balance),
      BigNumber(stakeToken2Balance).times(ratioValue),
    );

    const newToken1Amount = newToken2Amount.dividedBy(ratioValue);
    formik.setFieldValue("token1Amount", newToken1Amount.toString());
    formik.setFieldValue("token2Amount", newToken2Amount.toString());
  };

  return (
    <>
      <Modal className={classes.modal}>
        <Typography
          className={classes.heading}
          fontSize={18}
          fontWeight={600}
          variant="inherit">
          {type === "Stake" ? "Add Liquidity" : "Remove Liquidity"}
        </Typography>

        <div className={classes.nameContainer}>
          <Image src={image} height={35} width={35} alt={name} />
          <Typography fontSize={20} fontWeight={500} variant="inherit">
            {name}
          </Typography>
        </div>

        <div className={classes.stakeContainer}>
          <Typography fontSize={16} fontWeight={500} variant="inherit">
            You {type === "Stake" ? "Add Liquidity" : "Remove Liquidity"}
          </Typography>

          <div className={classes.inputContainer}>
            <div className={classes.tokenName}>
              <Image
                src={token1Details.tokenLogo}
                height={22}
                width={22}
                alt={token1Details.tokenName}
              />
              <Typography variant="inherit" fontSize={14}>
                {token1Details.tokenName}
              </Typography>
            </div>
            <TextField
              className={classes.input}
              placeholder="0"
              type={"number"}
              name="token1Amount"
              id="token1Amount"
              value={formik.values.token1Amount}
              onChange={(e) => {
                const newToken1Amount = e.target.value;
                const newToken2Amount =
                  BigNumber(newToken1Amount).times(ratioValue);
                formik.setFieldValue(
                  "token1Amount",
                  newToken1Amount.toString(),
                );
                formik.setFieldValue(
                  "token2Amount",
                  newToken2Amount.toString(),
                );
              }}
              onWheel={(e) => e.target.blur()}
              error={
                formik.touched.token1Amount &&
                Boolean(formik.errors.token1Amount)
              }
              helperText={
                formik.touched.token1Amount && formik.errors.token1Amount
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
              onClick={maxToken1Handler}
              className={classes.max}
              fontSize={16}
              fontWeight={500}
              variant="inherit">
              Max
            </Typography>
          </div>
          <div className={classes.inputContainer}>
            <div className={classes.tokenName}>
              <Image
                src={token2Details.tokenLogo}
                height={22}
                width={22}
                alt={token2Details.tokenName}
              />
              <Typography variant="inherit" fontSize={12} fontWeight={700}>
                {token2Details.tokenName}
              </Typography>
            </div>
            <TextField
              className={classes.input}
              placeholder="0"
              type={"number"}
              name="token2Amount"
              id="token2Amount"
              value={formik.values.token2Amount}
              onChange={(e) => {
                const newToken2Amount = e.target.value;
                const newToken1Amount =
                  BigNumber(newToken2Amount).dividedBy(ratioValue);
                formik.setFieldValue(
                  "token2Amount",
                  newToken2Amount.toString(),
                );
                formik.setFieldValue(
                  "token1Amount",
                  newToken1Amount.toString(),
                );
              }}
              onWheel={(e) => e.target.blur()}
              error={
                formik.touched.token2Amount &&
                Boolean(formik.errors.token2Amount)
              }
              helperText={
                formik.touched.token2Amount && formik.errors.token2Amount
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
              onClick={maxToken2Handler}
              className={classes.max}
              fontSize={16}
              fontWeight={500}
              variant="inherit">
              Max
            </Typography>
          </div>

          {/* {type === "Stake" ? ( */}
          <Typography
            className={classes.staked}
            fontSize={12}
            fontWeight={700}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            variant="inherit">
            You have{" "}
            {isFetchingValue ? (
              <TokenLoadingShimmer />
            ) : (
              <span>
                {isFetchingValue ? (
                  <TokenLoadingShimmer />
                ) : (
                  Number(stakeToken1Balance).toFixed(5)
                )}{" "}
                {token1Details?.tokenName} and{" "}
                {Number(stakeToken2Balance).toFixed(5)}{" "}
                {token2Details?.tokenName}
              </span>
            )}{" "}
            in your station
          </Typography>
          {/* ) : (
            <Typography
              className={classes.staked}
              fontSize={14}
              fontWeight={500}
              variant="inherit">
              Total of{" "}
              <span>
                {Number(staked).toFixed(4)}{" "}
                {executionId === 50
                  ? "meUSDC"
                  : executionId === 52
                  ? "aaveWETH"
                  : token}
              </span>{" "}
              is staked in this pool.
            </Typography>
          )} */}
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
          <button
            type="submit"
            onClick={formik.handleSubmit}
            className={classes.stake}>
            {type === "Stake" ? "Add Liquidity" : "Remove Liquidity"}
          </button>
        </div>
        <BackdropLoader isOpen={loading} />
      </Modal>
    </>
  );
};

export default StakingPoolModal;
