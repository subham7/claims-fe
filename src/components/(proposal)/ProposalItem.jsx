import React, { useState } from "react";
import classes from "./Proposal.module.scss";
import { Typography } from "@mui/material";
import Image from "next/image";
import { FaRegCopy } from "react-icons/fa";
import {
  getProposalAmount,
  getProposalImage,
  getProposalType,
  proposalItemObject,
  proposalItemVerb,
} from "utils/proposalHelpers/proposalItemHelper";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { useEffect } from "react";
import { isNative, shortAddress } from "utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { getProposalTxHash, patchProposalExecuted } from "api/proposal";
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
import { CHAIN_CONFIG } from "utils/constants";

const ProposalItem = ({
  type,
  executionId,
  proposal,
  daoAddress,
  routeNetworkId,
}) => {
  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [members, setMembers] = useState([]);
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

  const fetchProposalTxHash = async () => {
    const fetchedTxHash = localStorage.getItem(
      `stationx-proposal-${daoAddress}-${executionId}-${proposal.proposalId}`,
    );

    if (fetchedTxHash) {
      setTxHash(fetchedTxHash);
    } else {
      const data = await getProposalTxHash(proposal?.proposalId);
      localStorage.setItem(
        `stationx-proposal-${daoAddress}-${executionId}-${proposal.proposalId}`,
        data?.data[0]?.txHash,
      );
      setTxHash(data.data[0].txHash);
    }
  };

  const signHandler = async (proposalStatus) => {
    try {
      setTransactionLoading(true);
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
    if (type === "executed") {
      fetchProposalTxHash();
    }
  }, [type]);

  useEffect(() => {
    if (executionId && routeNetworkId) fetchProposalAmount();
  }, [executionId, routeNetworkId]);

  return (
    <div className={classes.proposal}>
      <div className={classes.proposalItemContainer}>
        <div className={classes.proposalDetails}>
          <Typography variant="inherit" fontSize={16} fontWeight={600}>
            {getProposalType(executionId)}
          </Typography>

          {amount.length ? (
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
          ) : null}

          <Typography variant="inherit" fontSize={16}>
            {proposalItemVerb(executionId)}
          </Typography>

          {getProposalImage(executionId).length ||
          proposalItemObject({
            executionId,
            proposal,
          }) ? (
            <div className={classes.imageInfo}>
              <Image
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
        </div>

        {type === "executed" ? (
          <div className={classes.executedContainer}>
            <Typography className={classes.executedText} variant="inherit">
              Executed
            </Typography>

            <div className={classes.txContainer}>
              <Typography className={classes.txText}>
                TX: {shortAddress(txHash)}
              </Typography>
              <FaRegCopy
                cursor={"pointer"}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${CHAIN_CONFIG[routeNetworkId].blockExplorerUrl}/tx/${txHash}`,
                  );
                  dispatchAlert("Transaction copied", "success");
                }}
                className={classes.copy}
              />
            </div>
          </div>
        ) : (
          <div className={classes.signContainer}>
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

            {signedOwners?.includes(walletAddress) && type === "execute" ? (
              <button
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
                onClick={() => signHandler("passed")}
                className={classes.signButton}>
                Sign
              </button>
            )}
          </div>
        )}
      </div>

      {proposal?.description?.length ? (
        <div className={classes.notesContainer}>
          <Typography className={classes.note}>
            📝 {proposal?.description}
          </Typography>
        </div>
      ) : null}

      {transactionLoading ? (
        <TransactionLoadingModal
          heading={`Proposal getting ${
            type === "sign" ? "signed" : "executed"
          } ⏳`}
          subheading={
            "It’s all happening onchain so this may take a minute or two."
          }
        />
      ) : null}
    </div>
  );
};

export default ProposalItem;
