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
  Tooltip,
  // InputLabel,
} from "@mui/material";
// import Image from "next/image";
import { CHAIN_CONFIG } from "utils/constants";
import { getTokensList } from "api/token";
import { getUserTokenData, handleSignMessage } from "utils/helper";
import { useFormik } from "formik";
// import { getProposalCommands } from "utils/proposalData";
import { useSelector } from "react-redux";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import dayjs from "dayjs";
import { getPublicClient } from "utils/viemConfig";
import { createProposal } from "api/proposal";
import { useAccount, useSignMessage } from "wagmi";
import BackdropLoader from "@components/common/BackdropLoader";
import { actionModalValidation } from "@components/createClubComps/ValidationSchemas";
import { MdInfo } from "react-icons/md";
import { walletAddressToEns } from "utils/helper";

const ActionModal = ({
  type,
  onClose,
  daoAddress,
  gnosisAddress,
  networkId,
  onActionComplete,
}) => {
  const { signMessageAsync } = useSignMessage();
  const [tokenData, setTokenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationSchema, setValidationSchema] = useState();
  const [showFeesAmount, setShowFeesAmount] = useState(false);
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

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const fetchLatestBlockNumber = async () => {
    const publicClient = getPublicClient(networkId);
    const block = Number(await publicClient.getBlockNumber());

    return block;
  };

  const createValidationSchema = (values) => {
    return actionModalValidation({
      actionType: type,
      selectedToken: values.airdropToken,
      showFeesAmount,
    });
  };
  const formik = useFormik({
    initialValues: {
      airdropToken: {
        symbol: "Choose asset to send",
      },
      recipient: "",
      airDropAmount: 0,
      feesAmount: 0,
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        let commands = {
          usdcTokenSymbol: "USDC",
          usdcTokenDecimal: 6,
          usdcGovernanceTokenDecimal: 18,
        };

        if (type === "send") {
          let recipientAddress = await walletAddressToEns(values?.recipient);
          commands = {
            customToken: values.airdropToken.address,
            customTokenAmounts: [
              convertToWeiGovernance(
                values.airDropAmount,
                values.airdropToken.decimals,
              ).toString(),
            ],
            customTokenAddresses: [recipientAddress],
            executionId: 4,
            ...commands,
          };
        } else if (type === "distribute") {
          commands = {
            airDropToken: values.airdropToken.address,
            airDropAmount: convertToWeiGovernance(
              values.airDropAmount,
              values.airdropToken.decimals,
            ).toString(),
            airDropCarryFee: values.feesAmount,
            executionId: 0,
            ...commands,
          };
        }

        const blockNum = await fetchLatestBlockNumber();

        const payload = {
          clubId: daoAddress,
          name: `${type?.charAt(0)?.toUpperCase() + type?.slice(1)} ${
            values.airDropAmount
          } $${values.airdropToken?.symbol}`,
          createdBy: walletAddress,
          votingDuration: dayjs().add(100, "year").unix(),
          votingOptions: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
          commands: [commands],
          type: "action",
          tokenType,
          daoAddress: daoAddress,
          block: blockNum,
          networkId: networkId,
        };

        const { signature } = await handleSignMessage(
          JSON.stringify(payload),
          signMessageAsync,
        );

        const request = await createProposal(isGovernanceActive, {
          ...payload,
          description: values.note
            ? values.note
            : `${type?.charAt(0)?.toUpperCase() + type?.slice(1)} ${
                values.airDropAmount
              } ${values.airdropToken?.symbol} to ${
                type === "distribute" ? "members" : values.recipient
              }`,
          signature,
        });

        onClose();
        setLoading(false);
        onActionComplete("success", request.data?.proposalId);
      } catch (error) {
        setLoading(false);
        onActionComplete("failure");
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

      setTokenData(
        data?.filter(
          (token) => token.symbol !== null && Number(token.balance) > 0,
        ),
      );
    }
  }, [daoAddress, networkId, gnosisAddress]);

  const maxHandler = () => {
    formik.setFieldValue(
      "airDropAmount",
      Number(
        convertFromWeiGovernance(
          formik.values.airdropToken.balance,
          formik.values.airdropToken.decimals,
        ),
      ),
    );
  };

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  useEffect(() => {
    const schema = createValidationSchema(formik.values);
    setValidationSchema(schema);
  }, [formik.values, showFeesAmount]);

  return (
    <Modal className={classes.modal}>
      <div className={classes.nameContainer}>
        {type === "send" ? (
          <div>
            <Typography fontSize={20} fontWeight={500} variant="inherit">
              Send <span>assets to another wallet</span>
            </Typography>

            <Typography
              color={"#707070"}
              fontSize={14}
              fontWeight={400}
              variant="inherit">
              Send assets from treasury to any onchain address or ENS.
            </Typography>
          </div>
        ) : (
          <div>
            <Typography fontSize={20} fontWeight={500} variant="inherit">
              Distribute <span>to members</span>
            </Typography>

            <Typography
              color={"#707070"}
              fontSize={14}
              fontWeight={400}
              variant="inherit">
              Distribute tokens directly from treasury on a pro-rata basis to
              members.
            </Typography>
          </div>
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
            renderValue={(selected) => (
              <>
                {selected.balance > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      fontFamily: "Avenir",
                    }}>
                    <Typography variant="inherit">{selected.symbol}</Typography>
                    <Typography variant="inherit">
                      Bal :{" "}
                      {Number(
                        convertFromWeiGovernance(
                          selected.balance,
                          selected.decimals,
                        ),
                      ).toFixed(3)}
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="inherit">{selected.symbol}</Typography>
                )}
              </>
            )}
            displayEmpty>
            {/* <MenuItem disabled>Choose asset to send</MenuItem> */}
            {tokenData?.map((token) => (
              <MenuItem value={token} key={token.symbol}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    fontFamily: "Avenir",
                  }}>
                  <Typography variant="inherit">{token.symbol}</Typography>
                </div>
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
            onClick={maxHandler}
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
            <input
              checked={showFeesAmount}
              // value={showFeesAmount}
              onChange={(e) => {
                setShowFeesAmount(e.target.checked);
              }}
              type="checkbox"
            />

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography variant="inherit">
                Deduct fee(s) before distributing
              </Typography>
              <Tooltip placement="right" title="Fees go to the admin wallet">
                <div>
                  <MdInfo
                    size={14}
                    style={{ cursor: "pointer", marginTop: "4px" }}
                  />
                </div>
              </Tooltip>
            </div>
          </div>

          {showFeesAmount && (
            <div className={classes.recipientContainer}>
              <Typography fontSize={16} fontWeight={500} variant="inherit">
                Fee(s) percentage
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
                    formik.touched.feesAmount &&
                    Boolean(formik.errors.feesAmount)
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
                        <Typography variant="inherit">%</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          )}
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

      <BackdropLoader isOpen={loading} />
    </Modal>
  );
};

export default ActionModal;
