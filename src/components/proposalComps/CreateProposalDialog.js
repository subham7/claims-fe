import { CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { Button } from "@components/ui";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import React, { useState } from "react";
import dayjs from "dayjs";
import ProposalActionForm from "./ProposalActionForm";
import { createProposal } from "../../api/proposal";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useNetwork } from "wagmi";
import { getProposalCommands } from "utils/proposalData";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { getProposalValidationSchema } from "@components/createClubComps/ValidationSchemas";
import useAppContractMethods from "hooks/useAppContractMethods";
import CommonProposalForm from "./CommonProposalForm";
import SurveyProposalForm from "./SurveyProposalForm";
import { setAlertData } from "redux/reducers/general";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";
import { proposalActionCommands } from "utils/proposalConstants";

const useStyles = makeStyles({
  main: {
    display: "flex",
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: "#151515",
  },
  dialogBox: {
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
  textField: {
    width: "100%",
    fontSize: "18px",
    marginTop: "0.5rem",
  },
  leftDiv: {
    width: "50%",
  },
  rightDiv: {
    width: "50%",
    height: "80vh",
    overflowY: "auto",
  },
});

const CreateProposalDialog = ({ daoAddress }) => {
  const classes = useStyles();
  const router = useRouter();
  const { executionId, nftData = [], tokenData = [] } = router.query;

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });
  const dispatch = useDispatch();

  const { getERC20TotalSupply, getNftOwnersCount } = useAppContractMethods({
    daoAddress,
  });

  const [loaderOpen, setLoaderOpen] = useState(false);

  const { getBalance, getDecimals } = useCommonContractMethods();

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const proposal = useFormik({
    initialValues: {
      tokenType: tokenType,
      typeOfProposal: executionId === "survey" ? "survey" : "action",
      proposalDeadline: dayjs(Date.now() + 3600 * 1000 * 24),
      proposalTitle: "",
      proposalDescription: "",
      optionList: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
      actionCommand: executionId === "survey" ? "" : Number(executionId),
      airdropToken: tokenData ? tokenData[0]?.address : "",
      amountToAirdrop: 0,
      carryFee: 0,
      pricePerToken: 0,
      quorum: 0,
      threshold: 0,
      totalDeposit: 0,
      customToken: tokenData ? tokenData[0]?.address : "",
      recieverAddress: "",
      amountToSend: 0,
      customNft: "",
      customNftToken: "",
      ownerChangeAction: "",
      ownerAddress: "",
      safeThreshold: 1,
      nftLink: "",
      csvObject: [],
      mintGTAddresses: [],
      mintGTAmounts: [],
      lensId: "",
      lensPostLink: "",
      aaveDepositToken: tokenData ? tokenData[0]?.address : "",
      aaveDepositAmount: 0,
      aaveWithdrawAmount: 0,
      aaveWithdrawToken: tokenData ? tokenData[0]?.address : "",
      uniswapSwapToken: tokenData ? tokenData[0]?.address : "",
      uniswapRecieverToken: "",
      uniswapSwapAmount: 0,
      stargateStakeToken: "",
      stargateStakeAmount: 0,
      stargateUnstakeToken: "",
      stargateUnstakeAmount: 0,
    },
    validationSchema: getProposalValidationSchema({
      networkId,
      getBalance,
      getDecimals,
      gnosisAddress,
      factoryData,
      walletAddress,
      daoAddress,
      getERC20TotalSupply,
      getNftOwnersCount,
      tokenType,
    }),
    onSubmit: async (values) => {
      try {
        setLoaderOpen(true);
        let commands = await getProposalCommands({
          values,
          tokenData,
          clubData,
          daoAddress,
          networkId,
        });

        commands = {
          executionId: values.actionCommand,
          ...commands,
          usdcTokenSymbol: "USDC",
          usdcTokenDecimal: 6,
          usdcGovernanceTokenDecimal: 18,
        };

        const payload = {
          clubId: daoAddress,
          name: values.proposalTitle,
          description: values.proposalDescription,
          createdBy: walletAddress,
          votingDuration: dayjs(values.proposalDeadline).unix(),
          votingOptions: values.optionList,
          commands: [values.typeOfProposal !== "survey" ? commands : null],
          type: values.typeOfProposal,
          tokenType: clubData.tokenType,
          daoAddress: daoAddress,
        };

        const createRequest = createProposal(payload, networkId);
        createRequest.then(async (result) => {
          if (result.status !== 201) {
            setLoaderOpen(false);
            dispatch(
              setAlertData({
                open: true,
                message: "Proposal creation failed!",
                severity: "error",
              }),
            );
          } else {
            dispatch(
              setAlertData({
                open: true,
                message: "Proposal created successfully!",
                severity: "success",
              }),
            );
            setLoaderOpen(false);
            router.back();
          }
        });
      } catch (error) {
        setLoaderOpen(false);
        dispatch(
          setAlertData({
            open: true,
            message: "Proposal creation failed!",
            severity: "error",
          }),
        );
      }
    },
  });
  return (
    <div className={classes.main}>
      <div className={classes.leftDiv}>
        <Grid
          container
          spacing={1}
          ml={-4}
          mb={2}
          onClick={() => router.back()}>
          <Grid item sx={{ "&:hover": { cursor: "pointer" } }}>
            <KeyboardBackspaceIcon className={classes.listFont} />
          </Grid>
          <Grid item sx={{ "&:hover": { cursor: "pointer" } }}>
            <Typography className={classes.listFont}>
              Back to all proposals
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="h5">
          {executionId === "survey"
            ? "Create a survey proposal"
            : proposalActionCommands[executionId]}
        </Typography>
      </div>
      <div className={classes.rightDiv}>
        <form onSubmit={proposal.handleSubmit} className={classes.form}>
          <CommonProposalForm proposal={proposal} />

          {/* proposal forms */}
          {proposal.values.typeOfProposal === "survey" ? (
            <Stack mt={1}>
              <SurveyProposalForm proposal={proposal} />
            </Stack>
          ) : (
            <Stack>
              <ProposalActionForm
                formik={proposal}
                tokenData={tokenData}
                nftData={nftData}
              />
            </Stack>
          )}

          <Grid container mt={2} spacing={3}>
            <Grid item>
              <Button type="submit">
                {loaderOpen ? <CircularProgress size={25} /> : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default CreateProposalDialog;
