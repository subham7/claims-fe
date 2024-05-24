import React from "react";
import classes from "./Proposal.module.scss";
import { Typography } from "@mui/material";
import Image from "next/image";
import { FaRegCopy } from "react-icons/fa";
import {
  getProposalType,
  proposalItemVerb,
} from "utils/proposalHelpers/proposalItemHelper";

const ProposalItem = ({ type, note = "", executionId = 42, proposal }) => {
  console.log("xxx", proposal?.commands[0]);
  return (
    <div className={classes.proposal}>
      <div className={classes.proposalItemContainer}>
        <div className={classes.proposalDetails}>
          <Typography variant="inherit" fontSize={16} fontWeight={600}>
            {getProposalType(executionId)}
          </Typography>
          <div className={classes.imageInfo}>
            <Image
              src={"/assets/icons/eth.png"}
              height={15}
              width={15}
              alt="ETH"
            />
            <Typography variant="inherit" fontSize={14}>
              1 ETH
            </Typography>
          </div>
          <Typography variant="inherit" fontSize={16}>
            {proposalItemVerb(executionId)}
          </Typography>
          <div className={classes.imageInfo}>
            <Image
              src={"/assets/icons/avatar2.png"}
              height={15}
              width={15}
              alt="image"
            />
            <Typography variant="inherit" fontSize={14}>
              0x823D...76RG
            </Typography>
          </div>
        </div>

        {type === "executed" ? (
          <div className={classes.executedContainer}>
            <Typography className={classes.executedText} variant="inherit">
              Executed
            </Typography>

            <div className={classes.txContainer}>
              <Typography className={classes.txText}>
                TX: 0x813B...6650
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
                1 out of 3
              </Typography>
            </div>
            <button className={classes.signButton}>Sign</button>
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
