import React, { useState } from "react";
import classes from "./PendingTransaction.module.scss";
import { Typography } from "@mui/material";
import Image from "next/image";
import {
  getNileAmount2,
  getProposalAmount,
  getProposalImage,
  getProposalType,
  proposalItemObject,
} from "utils/proposalHelpers/proposalItemHelper";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { useEffect } from "react";
import { isNative } from "utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { patchProposalExecuted } from "api/proposal";
import { useAccount } from "wagmi";
import useAppContractMethods from "hooks/useAppContractMethods";
import Web3 from "web3";
import {
  fetchABI,
  getEncodedData,
  getTokenTypeByExecutionId,
} from "utils/proposal";
import TransactionLoadingModal from "@components/modals/StatusModal/TransactionLoadingModal";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";

const PendingTransactionItem = ({
  executionId,
  proposal,
  daoAddress,
  routeNetworkId,
  onProposalUpdate,
}) => {
  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState([]);
  const [proposalType, setProposalType] = useState("");
  const [transactionLoading, setTransactionLoading] = useState(false);
  const { address: walletAddress } = useAccount();
  const dispatch = useDispatch();

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const signedOwners = proposal?.signedOwners ?? [];

  const { getDecimals, getTokenSymbol } = useCommonContractMethods({
    daoAddress,
    routeNetworkId,
  });

  const { updateProposalAndExecution } = useAppContractMethods({
    daoAddress,
    routeNetworkId,
  });

  const isNativeToken = isNative(clubData.depositTokenAddress, routeNetworkId);

  const fetchProposalAmount = async () => {
    const data = await getProposalAmount({
      executionId,
      proposal,
      getDecimals,
      getTokenSymbol,
      isNativeToken,
      routeNetworkId,
    });

    setAmount(data);
  };

  const signHandler = async (proposalStatus) => {
    try {
      setTransactionLoading(true);
      setProposalType(proposalStatus);
      const ABI = await fetchABI(
        proposal?.commands[0]?.executionId,
        clubData.tokenType,
      );

      const {
        data,
        approvalData,
        transactionData,
        membersArray,
        airDropAmountArray,
      } = await getEncodedData({
        getDecimals,
        proposalData: proposal,
        daoAddress,
        clubData,
        contractABI: ABI,
        setMembers,
        networkId: routeNetworkId,
        gnosisAddress,
      });

      const tokenData = getTokenTypeByExecutionId(proposal.commands);

      const response = await updateProposalAndExecution({
        data,
        approvalData,
        gnosisAddress: Web3.utils.toChecksumAddress(gnosisAddress),
        pid: proposal?.proposalId,
        tokenData,
        proposalStatus,
        proposalData: proposal,
        membersArray,
        airDropAmountArray,
        transactionData,
      });

      if (proposalStatus === "executed") {
        await patchProposalExecuted(proposal?.proposalId);
        dispatchAlert("Executed successfully", "success");
      } else {
        dispatchAlert("Signed successfully", "success");
      }
      onProposalUpdate();
      setTransactionLoading(false);
    } catch (error) {
      console.error(error);
      if (proposalStatus === "executed") {
        dispatchAlert("Execution failed", "error");
      } else {
        dispatchAlert("Signature failed", "error");
      }

      setTransactionLoading(false);
    }
  };

  useEffect(() => {
    if (executionId && routeNetworkId) fetchProposalAmount();
  }, [executionId, routeNetworkId]);

  return (
    <div>
      <div className={classes.pendingTransactionItem}>
        <Typography variant="inherit" fontSize={16} fontWeight={800}>
          {getProposalType(executionId)}
        </Typography>

        {amount.length ? (
          <>
            <div className={classes.imageInfo}>
              <Image
                src={
                  amount.includes("ETH")
                    ? "/assets/icons/eth.png"
                    : amount.includes("USDC")
                    ? "/assets/icons/usdc.png"
                    : amount.includes("MATIC")
                    ? "/assets/networks/0x89.png"
                    : "/assets/icons/testToken.png"
                }
                height={15}
                width={15}
                alt="ETH"
              />
              <Typography variant="inherit" fontSize={14}>
                {amount}
              </Typography>
            </div>

            {executionId === 63 || executionId === 64 ? (
              <>
                &
                <div className={classes.imageInfo}>
                  <Image
                    src={"/assets/icons/eth.png"}
                    height={15}
                    width={15}
                    alt="ETH"
                  />
                  <Typography variant="inherit" fontSize={14}>
                    {getNileAmount2({
                      executionId,
                      proposal,
                    })}
                  </Typography>
                </div>
              </>
            ) : null}
          </>
        ) : (
          <>
            {getProposalImage(executionId).length ||
            proposalItemObject({
              executionId,
              proposal,
            }) ? (
              <div className={classes.imageInfo}>
                <Image
                  style={{
                    borderRadius: "25px",
                  }}
                  src={
                    getProposalImage(executionId) ?? "/assets/icons/avatar2.png"
                  }
                  height={15}
                  width={15}
                  alt="image"
                />

                <Typography variant="inherit" fontSize={14}>
                  {proposalItemObject({ executionId, proposal })}
                </Typography>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className={classes.signSection}>
        <div className={classes.signInfo}>
          <Image
            src={"/assets/icons/sign.png"}
            height={15}
            width={15}
            alt="Sign"
          />
          <Typography className={classes.signText} variant="inherit">
            {signedOwners.length} out of {clubData?.currentSafeThreshold}
          </Typography>
        </div>

        {signedOwners?.length >= clubData?.currentSafeThreshold ? (
          <button
            disabled={!isAdmin}
            onClick={() => signHandler("executed")}
            className={classes.executeButton}>
            Execute
          </button>
        ) : signedOwners?.includes(walletAddress) ? (
          <button disabled className={classes.signButton}>
            Signed
          </button>
        ) : (
          <button
            disabled={
              !isAdmin || signedOwners?.length >= clubData?.currentSafeThreshold
            }
            onClick={() => signHandler("passed")}
            className={classes.signButton}>
            Sign
          </button>
        )}
      </div>

      {transactionLoading ? (
        <TransactionLoadingModal
          heading={`Proposal getting ${
            proposalType === "sign" ? "signed" : "executed"
          } ⏳`}
          subheading={
            "It’s all happening onchain so this may take a minute or two."
          }
        />
      ) : null}
    </div>
  );
};

export default PendingTransactionItem;
