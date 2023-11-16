import {
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Button } from "@components/ui";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import React, { useState } from "react";

import dayjs from "dayjs";
import ProposalActionForm from "./ProposalActionForm";
import { createProposal } from "../../api/proposal";
import { useSelector } from "react-redux";
import { useAccount, useNetwork } from "wagmi";
import { getProposalCommands } from "utils/proposalData";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { getProposalValidationSchema } from "@components/createClubComps/ValidationSchemas";
import CustomAlert from "@components/common/CustomAlert";
import useAppContractMethods from "hooks/useAppContractMethods";
import CommonProposalForm from "./CommonProposalForm";
import SurveyProposalForm from "./SurveyProposalForm";
import { getPublicClient } from "utils/viemConfig";
import { handleSignMessage } from "utils/helper";

const useStyles = makeStyles({
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
    // margin: "16px 0 25px 0",
    fontSize: "18px",

    marginTop: "0.5rem",
  },
});

const CreateProposalDialog = ({
  open,
  setOpen,
  onClose,
  tokenData,
  nftData,
  daoAddress,
  fetchProposalList,
}) => {
  const classes = useStyles();

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const { getERC20TotalSupply, getNftOwnersCount } = useAppContractMethods();

  const [loaderOpen, setLoaderOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState("");

  const showMessageHandler = () => {
    setOpenSnackBar(true);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 4000);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
    setLoaderOpen(false);
  };

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

  const proposal = useFormik({
    initialValues: {
      tokenType: tokenType,
      typeOfProposal: "action",
      proposalDeadline: dayjs(Date.now() + 3600 * 1000 * 24),
      proposalTitle: "",
      proposalDescription: "",
      blockNum: "",
      optionList: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
      actionCommand: "",
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
        const blockNum = await fetchLatestBlockNumber();
        console.log("clubdata", clubData);
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
          quorum: Number(clubData.quorum),
          threshold: Number(clubData.threshold),
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
            setOpenSnackBar(true);
            setFailed(true);
            setLoaderOpen(false);
          } else {
            fetchProposalList();
            setOpenSnackBar(true);
            setMessage("Proposal created successfully!");
            setFailed(true);
            showMessageHandler();
            setOpen(false);
            setLoaderOpen(false);
          }
        });
      } catch (error) {
        setMessage(error.message ?? error);
        setLoaderOpen(false);
        setOpenSnackBar(true);
        setFailed(false);
        showMessageHandler();
      }
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        scroll="body"
        PaperProps={{ classes: { root: classes.modalStyle } }}
        fullWidth
        maxWidth="lg">
        <DialogContent
          sx={{
            overflow: "hidden",
            backgroundColor: "#151515",
            padding: "3rem",
          }}>
          <form onSubmit={proposal.handleSubmit} className={classes.form}>
            <Typography className={classes.dialogBox}>
              Create proposal
            </Typography>

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

            {/* Submit Button */}
            <Grid container mt={2} spacing={3}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
                <Button
                  onClick={() => {
                    proposal.resetForm();
                    setLoaderOpen(false);
                    onClose(event, "cancel");
                  }}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit">
                  {loaderOpen ? <CircularProgress size={25} /> : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      {openSnackBar ? (
        <CustomAlert alertMessage={message} severity={failed} />
      ) : null}
    </>
  );
};

export default CreateProposalDialog;
