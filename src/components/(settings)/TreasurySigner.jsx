import React, { useEffect, useState } from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { BiPlus } from "react-icons/bi";
import { Typography } from "@mui/material";
import classNames from "classnames";
import { RxCross2 } from "react-icons/rx";
import { getProposalCommands } from "utils/proposalData";
import { fetchLatestBlockNumber } from "utils/globalFunctions";
import { useAccount, useSignMessage } from "wagmi";
import dayjs from "dayjs";
import { handleSignMessage } from "utils/helper";
import { createProposal } from "api/proposal";
import { useSelector } from "react-redux";
import { GoPencil } from "react-icons/go";
import { isMember } from "utils/stationsSubgraphHelper";
import { Box } from "@mui/material";
import CustomSkeleton from "@components/skeleton/CustomSkeleton";
import { ensToWalletAddress } from "utils/helper";
import { isValidReciptentAddress } from "utils/helper";
const TreasurySigner = ({
  clubData,
  daoAddress,
  routeNetworkId,
  setLoading,
  handleActionComplete,
  settingIsLoading,
}) => {
  const { signMessageAsync } = useSignMessage();
  const [newArr, setNewArr] = useState([]);
  const [showEditButton, setShowEditButton] = useState(true);
  const [showAddDeleteButtons, setShowAddDeleteButtons] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [showErrorText, setShowErrorText] = useState(false);
  const [type, setType] = useState(null);
  const [errText, setErrText] = useState("");
  const { adminAddresses, currentSafeThreshold } = clubData;
  const { address: walletAddress } = useAccount();

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

  const submitHandler = async () => {
    try {
      setLoading(true);
      let ownerAddress = await ensToWalletAddress(newArr[newArr.length - 1]);
      let isValid = await isValidReciptentAddress(ownerAddress);
      if (!isValid) {
        setErrText("Invalid address");
        setShowErrorText(true);
        setLoading(false);
        return;
      } else {
        setShowErrorText(false);
      }
      if (
        routeNetworkId !== "0x1" &&
        routeNetworkId !== "0x89" &&
        type === "add"
      ) {
        const isStationMember = await isMember(
          newArr[newArr.length - 1],
          daoAddress,
          routeNetworkId,
        );

        if (!isStationMember?.users?.length > 0) {
          setErrText("Address is not a member of station");
          setShowErrorText(true);
          setLoading(false);
          return;
        } else {
          setShowErrorText(false);
        }
      }
      const values = {
        ownerAddress: type === "add" ? ownerAddress : newArr[clickedIndex],
        safeThreshold:
          type !== "add"
            ? Number(currentSafeThreshold) > 1
              ? Number(currentSafeThreshold) - 1
              : Number(currentSafeThreshold)
            : Number(currentSafeThreshold) + 1,
        actionCommand: type === "add" ? 6 : 7,
        title: type === "add" ? "Add signer" : "Remove signer",
        note: `${
          type === "add"
            ? `Add signer - ${newArr[newArr.length - 1]}`
            : `Remove signer - ${newArr[clickedIndex]}`
        }`,
      };

      let commands = await getProposalCommands({
        values,
        clubData,
        daoAddress,
        networkId: routeNetworkId,
      });

      const blockNum = await fetchLatestBlockNumber(routeNetworkId);
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
        JSON.stringify(payload),
        signMessageAsync,
      );

      const request = await createProposal(isGovernanceActive, {
        ...payload,
        description: values.note,
        signature,
      });
      setLoading(false);
      handleActionComplete("success", request.data?.proposalId);
    } catch (error) {
      setLoading(false);
      handleActionComplete("failure");
    }
  };

  useEffect(() => {
    if (adminAddresses && adminAddresses?.length > 0)
      setNewArr([...adminAddresses].reverse());
  }, [adminAddresses]);

  return (
    <>
      {!settingIsLoading ? (
        <Box sx={{ width: "400px" }}>
          <CustomSkeleton
            marginTop={"20px"}
            width={"100%"}
            height={40}
            length={1}
          />
        </Box>
      ) : (
        <div className={classes.treasurySignerContainer}>
          {newArr?.map((signer, index) => (
            <div key={index} className={classes.copyTextContainer}>
              <input
                onChange={(e) => {
                  const address = e.target.value;
                  const list = [...newArr];
                  list[index] = address;
                  setNewArr(list);
                }}
                placeholder="0x"
                className={classes.input}
                value={newArr[index]}
                disabled={adminAddresses[index]}
                style={{
                  margin: "4px 0",
                }}
              />

              {showDeleteIcons && (
                <RxCross2
                  key={index}
                  onClick={() => {
                    setClickedIndex(index);
                  }}
                  className={
                    clickedIndex === index
                      ? classNames(classes.icon, classes.delete)
                      : classes.icon
                  }
                />
              )}

              {!adminAddresses[index] && (
                <RxCross2
                  className={classNames(classes.icon, classes.delete)}
                  onClick={() => {
                    const list = [...newArr];
                    list.splice(index, 1);
                    setNewArr(list);
                    setShowSaveButton(false);
                    setShowAddDeleteButtons(true);
                  }}
                />
              )}
            </div>
          ))}

          {showErrorText && (
            <Typography
              variant="inherit"
              fontSize={12}
              color={"red"}
              ml={1}
              mt={0.5}>
              {/* Address is not a member of station */}
              {errText}
            </Typography>
          )}

          {isAdmin && showEditButton && adminAddresses?.length && (
            <button
              onClick={() => {
                setShowAddDeleteButtons(true);
                setShowEditButton(false);
              }}>
              <Typography variant="inherit" mr={0.5} fontSize={14}>
                Edit
              </Typography>
              <GoPencil size={12} />
            </button>
          )}

          {showAddDeleteButtons ? (
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}>
              <button
                onClick={() => {
                  setNewArr([...newArr, ""]);
                  setShowAddDeleteButtons(false);
                  setShowSaveButton(true);
                  setType("add");
                }}>
                <Typography variant="inherit">Add</Typography>
                <BiPlus size={15} />
              </button>

              {newArr?.length > 1 ? (
                <button
                  onClick={() => {
                    setShowAddDeleteButtons(false);
                    setShowDeleteIcons(true);
                    setShowSaveButton(true);
                    setType("delete");
                  }}>
                  <Typography variant="inherit">Delete</Typography>
                </button>
              ) : null}
            </div>
          ) : null}

          {showSaveButton && (
            <button onClick={submitHandler}>
              <Typography variant="inherit">Save</Typography>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default TreasurySigner;
