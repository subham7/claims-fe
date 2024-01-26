import { CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { Button } from "@components/ui";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
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
import { getPublicClient } from "utils/viemConfig";
import { handleSignMessage } from "utils/helper";
import { setAlertData } from "redux/reducers/alert";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";
import { proposalActionCommands } from "utils/proposalConstants";
import { getNFTsByDaoAddress } from "api/assets";
import { getUserTokenData } from "utils/helper";
import { getTokensList } from "api/token";
import { addNftsOwnedByDao } from "redux/reducers/club";
import { CHAIN_CONFIG } from "utils/constants";

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
  const [nftData, setNftData] = useState([]);
  const [tokenData, setTokenData] = useState([]);

  let { executionId } = router.query;

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

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const fetchLatestBlockNumber = async () => {
    const publicClient = getPublicClient(networkId);
    const block = Number(await publicClient.getBlockNumber());

    return block;
  };

  const fetchTokens = useCallback(async () => {
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
  }, [daoAddress, networkId, gnosisAddress]);

  const fetchNfts = useCallback(async () => {
    try {
      const nftsData = await getNFTsByDaoAddress(gnosisAddress, networkId);
      setNftData(nftsData.data?.items);
      dispatch(addNftsOwnedByDao(nftsData.data?.items));
    } catch (error) {
      console.log(error);
    }
  }, [networkId, dispatch, gnosisAddress]);

  useEffect(() => {
    if (daoAddress) {
      fetchTokens();
      fetchNfts();
    }
  }, [daoAddress, fetchNfts, fetchTokens]);

  const proposal = useFormik({
    initialValues: {
      tokenType: tokenType,
      typeOfProposal: executionId === "survey" ? "survey" : "action",
      proposalDeadline: dayjs(Date.now() + 3600 * 1000 * 24),
      proposalTitle: "",
      proposalDescription: "",
      blockNum: "",
      optionList: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
      actionCommand: executionId === "survey" ? "" : Number(executionId),
      airdropToken: tokenData ? tokenData[0]?.address : "",
      amountToAirdrop: 0,
      carryFee: 0,
      pricePerToken: 0,
      nftSupply: 0,
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
      sendToken: "",
      csvObject: [],
      sendTokenAddresses: [],
      sendTokenAmounts: [],
      clipFinanceDepositToken: tokenData ? tokenData[0]?.address : "",
      clipFinanceDepositAmount: 0,
      clipFinanceWithdrawAmount: 0,
      clipFinanceWithdrawToken: tokenData ? tokenData[0]?.address : "",
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
        const blockNum = await fetchLatestBlockNumber();
        const payload = {
          clubId: daoAddress,
          name: values.proposalTitle,
          createdBy: walletAddress,
          votingDuration: dayjs(values.proposalDeadline).unix(),
          votingOptions: values.optionList,
          commands: [values.typeOfProposal !== "survey" ? commands : null],
          type: values.typeOfProposal,
          tokenType: clubData.tokenType,
          daoAddress: daoAddress,
          block:
            values.blockNum !== undefined &&
            values.blockNum !== null &&
            values.blockNum.length > 0
              ? values.blockNum
              : Number(blockNum),
          // quorum: Number(clubData.quorum),
          // threshold: Number(clubData.threshold),
          networkId: networkId,
        };
        const { signature } = await handleSignMessage(
          walletAddress,
          JSON.stringify(payload),
        );
        const createRequest = createProposal(isGovernanceActive, {
          ...payload,
          description: values.proposalDescription,
          signature,
        });
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
