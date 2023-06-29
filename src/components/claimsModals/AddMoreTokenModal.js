import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ClaimModalStyles } from "./ClaimModalStyles";
import ModalCard from "./ModalCard";
import { useFormik } from "formik";
import * as yup from "yup";
import useSmartContractMethods from "../../hooks/useSmartContractMethods";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";

const AddMoreTokenModal = ({
  onClose,
  airdropTokenDetails,
  addMoreTokensHandler,
}) => {
  const [balance, setBalance] = useState(0);
  const { getBalance } = useSmartContractMethods();

  const formik = useFormik({
    initialValues: {
      noOfTokens: 0,
    },
    validationSchema: yup.object({
      noOfTokens: yup.number().required("No. of Tokens is required"),
    }),
    onSubmit: (value) => {
      addMoreTokensHandler(value.noOfTokens);
      onClose();
    },
  });

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const balanceOfUser = await getBalance(
          airdropTokenDetails?.tokenAddress,
        );
        setBalance(balanceOfUser);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserBalance();
  }, [airdropTokenDetails?.tokenAddress]);

  const classes = ClaimModalStyles();
  return (
    <ModalCard onClose={onClose}>
      <h2 className={classes.title}>Add more tokens </h2>
      <p className={classes.subtitle}>
        You can add more tokens into this vault for the duration of this claim.
      </p>

      <div className={classes.tokenInputContainer}>
        <input
          id="noOfTokens"
          name="noOfTokens"
          placeholder="1000"
          className={classes.tokenInput}
          value={formik.values.noOfTokens}
          onChange={formik.handleChange}
        />

        <div className={classes.balanceContainer}>
          <p className={classes.smallText}>
            Balance:{" "}
            {Number(
              convertFromWeiGovernance(
                balance,
                airdropTokenDetails.tokenDecimal,
              ),
            ).toFixed(2)}{" "}
            ${airdropTokenDetails.tokenSymbol}
          </p>
          <button
            onClick={() => {
              formik.setFieldValue(
                "noOfTokens",
                Number(
                  convertFromWeiGovernance(
                    balance,
                    airdropTokenDetails.tokenDecimal,
                  ),
                ),
              );
            }}
            className={classes.submitBtn}>
            Max
          </button>
        </div>
      </div>

      <div className={classes.buttonContainers}>
        <Button
          onClick={onClose}
          sx={{
            fontSize: "18px",
            background: "#fff",
            color: "#3A7AFD",
          }}
          variant="primary">
          Cancel
        </Button>
        <Button
          sx={{
            fontSize: "18px",
            width: "130px",
          }}
          disabled={formik.values.noOfTokens <= 0}
          onClick={formik.handleSubmit}
          variant="primary">
          Add
        </Button>
      </div>
    </ModalCard>
  );
};

export default AddMoreTokenModal;
