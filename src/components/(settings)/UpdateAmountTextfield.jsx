import React, { useEffect, useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import classes from "@components/(settings)/Settings.module.scss";
import { IoMdCheckmark } from "react-icons/io";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { getProposalCommands } from "utils/proposalData";
import { getPublicClient } from "utils/viemConfig";
import { useAccount } from "wagmi";

import dayjs from "dayjs";
import { createProposal } from "api/proposal";
import { handleSignMessage } from "utils/helper";

const dummyData = (amount, symbol, type) => {
  switch (type) {
    case "updateMinDeposit":
      return {
        title: "Update Minimum deposit amount",
        description: `Update minimum deposit amount to ${amount} ${symbol}`,
        actionCommand: 49,
      };

    case "updateMaxDeposit":
      return {
        title: "Update Maximum deposit amount",
        description: `Update maximum deposit amount to ${amount} ${symbol}`,
        actionCommand: 50,
      };

    case "updatePricePerToken":
      return {
        title: "Update price per token",
        description: `Update price per token to ${amount} ${symbol}`,
        actionCommand: 13,
      };

    case "updateRaiseAmount":
      return {
        title: "Update total raise amount",
        description: `Update total raise amount to ${amount} ${symbol}`,
        actionCommand: 3,
      };

    default:
      break;
  }
};

const UpdateAmountTextfield = ({
  prevAmount,
  className,
  routeNetworkId,
  daoAddress,
  type,
  setLoading,
  handleActionComplete,
}) => {
  const [canEdit, setCanEdit] = useState(false);
  const [amount, setAmount] = useState(prevAmount);
  const inputRef = useRef(null);

  const { address: walletAddress } = useAccount();

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const fetchLatestBlockNumber = async () => {
    const publicClient = getPublicClient(routeNetworkId);
    const block = Number(await publicClient.getBlockNumber());

    return block;
  };

  const submitHandler = async () => {
    try {
      setLoading(true);
      const values = {
        updatedMinimumDepositAmount: amount,
        updatedMaximumDepositAmount: amount,
        totalDeposit: amount,
        pricePerToken: amount,
        actionCommand: dummyData(amount, clubData?.depositTokenSymbol, type)
          .actionCommand,
        note: dummyData(amount, clubData?.depositTokenSymbol, type).description,
        title: dummyData(amount, clubData?.depositTokenSymbol, type).title,
      };

      debugger;
      let commands = await getProposalCommands({
        values,
        clubData,
        daoAddress,
        networkId: routeNetworkId,
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
        name: values.title,
        createdBy: walletAddress,
        votingDuration: dayjs().add(100, "year").unix(),
        votingOptions: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
        commands: [commands],
        type: "action",
        tokenType,
        daoAddress: daoAddress,
        block: blockNum,
        networkId: routeNetworkId,
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
      setLoading(false);
      setCanEdit(false);
      handleActionComplete("success", request.data?.proposalId);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setCanEdit(false);
      handleActionComplete("failure");
    }
  };

  const checkMarkClass =
    prevAmount !== amount && amount > 0 ? classes.active : classes.disabled;

  useEffect(() => {
    if (canEdit) {
      inputRef.current && inputRef.current.focus();
    }
  }, [canEdit]);

  return (
    <div className={classes.copyTextContainer}>
      <div className={classNames(classes.amountInputField, className)}>
        <input
          ref={inputRef}
          type="number"
          disabled={!canEdit}
          className={classes.amountInput}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          value={amount}
        />
        <div>USDC</div>
      </div>
      {isAdmin ? (
        <>
          {canEdit ? (
            <IoMdCheckmark
              onClick={submitHandler}
              className={classNames(classes.icon, checkMarkClass)}
            />
          ) : (
            <GoPencil
              onClick={() => {
                setCanEdit(true);
              }}
              className={classes.icon}
            />
          )}
        </>
      ) : null}
    </div>
  );
};

export default UpdateAmountTextfield;
