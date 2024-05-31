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
import { useSelector } from "react-redux";
import { getProposalTxHash } from "api/proposal";
import { useAccount } from "wagmi";
const ProposalItem = ({
  type,
  note = "",
  executionId,
  proposal,
  daoAddress,
  routeNetworkId,
}) => {
  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const { address: walletAddress } = useAccount();

  const signedOwners = proposal?.signedOwners ?? [];

  const { getDecimals, getTokenSymbol } = useCommonContractMethods({
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
              <FaRegCopy className={classes.copy} />
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

            {signedOwners?.includes(walletAddress) ? (
              <button disabled className={classes.signButton}>
                Signed
              </button>
            ) : (
              <button className={classes.signButton}>Sign</button>
            )}
          </div>
        )}
      </div>

      {note?.length ? (
        <div className={classes.notesContainer}>
          <Typography className={classes.note}>
            📝 Sending funds to Aman for getting shit done!
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

export default ProposalItem;
