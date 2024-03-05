import React, { useCallback, useEffect, useState } from "react";
import classes from "./ActionModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import {
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  // InputLabel,
} from "@mui/material";
// import Image from "next/image";
import { CHAIN_CONFIG } from "utils/constants";
import { getTokensList } from "api/token";
import { getUserTokenData } from "utils/helper";
import { useFormik } from "formik";
// import { getProposalCommands } from "utils/proposalData";
import { useSelector } from "react-redux";
import { convertToWeiGovernance } from "utils/globalFunctions";

const ActionModal = ({
  type,
  onClose,
  daoAddress,
  gnosisAddress,
  networkId,
}) => {
  const [tokenData, setTokenData] = useState([]);

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const formik = useFormik({
    initialValues: {
      airdropToken: "",
      recipient: "",
      airDropAmount: 0,
      feesAmount: 0,
      note: "",
    },

    onSubmit: async (values) => {
      try {
        if (type === "send") {
          let commands = {
            airdropToken: values.airdropToken.address,
            airdropAmount: convertToWeiGovernance(
              values.airDropAmount,
              values.airdropToken.decimals,
            ),
            usdcTokenSymbol: "USDC",
            usdcTokenDecimal: 6,
            usdcGovernanceTokenDecimal: 18,
            executionId: 0,
          };

          // const payload = {
          //   clubId: daoAddress,
          //   name: `${name} - ${type}`,
          //   createdBy: walletAddress,
          //   votingDuration: dayjs().add(100, "year").unix(),
          //   votingOptions: [
          //     { text: "Yes" },
          //     { text: "No" },
          //     { text: "Abstain" },
          //   ],
          //   commands: [commands],
          //   type: "action",
          //   tokenType,
          //   daoAddress: daoAddress,
          //   block: blockNum,
          //   networkId: networkId,
          // };

          const { signature } = await handleSignMessage(
            walletAddress,
            JSON.stringify(payload),
          );

          const request = await createProposal(isGovernanceActive, {
            ...payload,
            description: values.note,
            signature,
          });
        } else if (type === "distribute") {
        }
      } catch (error) {
        console.log("xxx", error);
      }
    },
  });

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

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  console.log("xxx", tokenData);

  return (
    <Modal onClose={onClose} className={classes.modal}>
      <div className={classes.nameContainer}>
        {type === "send" ? (
          <Typography fontSize={20} fontWeight={500} variant="inherit">
            Send <span>to another wallet</span>
          </Typography>
        ) : (
          <Typography fontSize={20} fontWeight={500} variant="inherit">
            Distribute <span>to members</span>
          </Typography>
        )}
      </div>

      <div>
        <FormControl
          sx={{
            width: "100%",
            background: "#282828",
            borderRadius: "8px",
            marginBottom: "12px",
            marginTop: "16px",
            paddingY: "4px",
          }}>
          <Select
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              fontFamily: "inherit",
              backgroundColor: "inherit",
            }}
            name="airdropToken"
            id="airdropToken"
            value={formik.values.airdropToken}
            onChange={formik.handleChange}
            error={
              formik.touched.airdropToken && Boolean(formik.errors.airdropToken)
            }
            helperText={
              formik.touched.airdropToken && formik.errors.airdropToken
            }
            renderValue={(selected) => selected.symbol}
            displayEmpty>
            <MenuItem disabled>Choose asset to send</MenuItem>
            {tokenData.map((token) => (
              <MenuItem value={token} key={token.symbol}>
                <Typography variant="inherit">{token.symbol}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className={classes.stakeContainer}>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.input}
            placeholder="0"
            type={"number"}
            name="airDropAmount"
            id="airDropAmount"
            onWheel={(e) => e.target.blur()}
            value={formik.values.airDropAmount}
            onChange={formik.handleChange}
            error={
              formik.touched.airDropAmount &&
              Boolean(formik.errors.airDropAmount)
            }
            helperText={
              formik.touched.airDropAmount && formik.errors.airDropAmount
            }
            sx={{
              "& fieldset": { border: "none" },
              "& .MuiInputBase-root": {
                backgroundColor: "transparent",
                fontSize: "20px",
                fontFamily: "inherit",
              },
              "& ::placeholder": {
                color: "#707070",
                opacity: 1,
              },
            }}
          />
          <Typography
            // onClick={maxHandler}
            className={classes.max}
            fontSize={16}
            fontWeight={500}
            variant="inherit">
            Max
          </Typography>
        </div>
      </div>

      {type === "send" && (
        <div className={classes.recipientContainer}>
          <Typography fontSize={16} fontWeight={500} variant="inherit">
            Recipient
          </Typography>
          <div className={classes.inputContainer}>
            <TextField
              className={classes.input}
              placeholder="Insert address or ENS"
              type={"text"}
              name="recipient"
              id="recipient"
              value={formik.values.recipient}
              onChange={formik.handleChange}
              error={
                formik.touched.recipient && Boolean(formik.errors.recipient)
              }
              helperText={formik.touched.recipient && formik.errors.recipient}
              sx={{
                "& fieldset": { border: "none" },
                "& .MuiInputBase-root": {
                  backgroundColor: "transparent",
                  fontSize: "16px",
                  fontFamily: "inherit",
                },
                "& ::placeholder": {
                  color: "#707070",
                  opacity: 1,
                  fontSize: "16px",
                },
              }}
            />
          </div>
        </div>
      )}

      {type === "distribute" && (
        <>
          <div className={classes.flexContainer}>
            <input type="checkbox" />
            <Typography variant="inherit">
              Deduct fee(s) before distributing
            </Typography>
          </div>

          <div className={classes.recipientContainer}>
            <Typography fontSize={16} fontWeight={500} variant="inherit">
              Fees amount
            </Typography>
            <div className={classes.inputContainer}>
              <TextField
                className={classes.input}
                placeholder="0.01"
                type={"number"}
                name="feesAmount"
                id="feesAmount"
                onWheel={(e) => e.target.blur()}
                value={formik.values.feesAmount}
                onChange={formik.handleChange}
                error={
                  formik.touched.feesAmount && Boolean(formik.errors.feesAmount)
                }
                helperText={
                  formik.touched.feesAmount && formik.errors.feesAmount
                }
                sx={{
                  "& fieldset": { border: "none" },
                  "& .MuiInputBase-root": {
                    backgroundColor: "transparent",
                    fontSize: "16px",
                    fontFamily: "inherit",
                  },
                  "& ::placeholder": {
                    color: "#707070",
                    opacity: 1,
                    fontSize: "16px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ color: "#dcdcdc" }}>
                      <Typography variant="inherit">USDC</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </>
      )}

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
          placeholder="Add a note"
          multiline
          rows={2}
          className={classes.note}
        />
      </div>

      <div className={classes.buttonContainer}>
        <button onClick={onClose} className={classes.cancel}>
          Cancel
        </button>
        <button onClick={formik.handleSubmit} className={classes.stake}>
          Done
        </button>
      </div>
    </Modal>
  );
};

export default ActionModal;
