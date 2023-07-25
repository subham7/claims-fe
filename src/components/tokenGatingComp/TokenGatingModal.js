import { Alert, Button, Typography } from "@mui/material";
import { TextField } from "@components/ui";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import { TokenGatingModalStyles } from "./TokenGatingModalStyles";
import useSmartContractMethods from "../../hooks/useSmartContractMethods";

const Backdrop = ({ onClick }) => {
  const classes = TokenGatingModalStyles();

  return <div onClick={onClick} className={classes.backdrop}></div>;
};

const TokenGatingModal = ({ closeModal, chooseTokens }) => {
  const [notValid, setNotValid] = useState(false);
  const classes = TokenGatingModalStyles();

  const { getTokenSymbol, getDecimals } = useSmartContractMethods();

  const formik = useFormik({
    initialValues: {
      address: "",
      noOfTokens: "",
    },
    validationSchema: yup.object().shape({
      address: yup.string().required("Please enter token address"),
      noOfTokens: yup
        .number()
        .required("Please enter number of tokens")
        .moreThan(0, "Amount should be greater than 0"),
    }),

    onSubmit: (values) => {
      let tokenSymbol,
        tokenDecimal = 0;
      if (values.address) {
        const checkTokenGating = async () => {
          try {
            tokenSymbol = await getTokenSymbol(values.address);
            try {
              tokenDecimal = await getDecimals(values.address);
            } catch (err) {
              console.log(err);
            }

            chooseTokens({
              tokenSymbol: tokenSymbol,
              tokenAddress: values.address,
              tokenAmount: values.noOfTokens,
              tokenDecimal: tokenDecimal ? tokenDecimal : 0,
            });
            closeModal();
          } catch (error) {
            console.log(error);

            setTimeout(() => {
              setNotValid(false);
            }, 3000);
            setNotValid(true);
          }
        };
        checkTokenGating();
      }
    },
  });

  return (
    <>
      <Backdrop onClick={closeModal} />
      <div className={classes.container}>
        <form className={classes.form}>
          <div>
            <Typography className={classes.label}>Select token</Typography>
            <TextField
              name="address"
              id="address"
              type="text"
              placeholder="Paste address here"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </div>

          <div>
            <Typography className={classes.label}>
              Minimum amount of tokens
            </Typography>
            <TextField
              name="noOfTokens"
              id="noOfTokens"
              type={"number"}
              placeholder="Eg. 100"
              value={formik.values.noOfTokens}
              onChange={formik.handleChange}
              error={
                formik.touched.noOfTokens && Boolean(formik.errors.noOfTokens)
              }
              helperText={formik.touched.noOfTokens && formik.errors.noOfTokens}
            />
          </div>

          <div className={classes.btns}>
            <Button className={classes.cancelBtn} onClick={closeModal}>
              Cancel
            </Button>
            <Button className={classes.addBtn} onClick={formik.handleSubmit}>
              Add
            </Button>
          </div>
        </form>
      </div>

      {notValid && (
        <Alert
          severity="error"
          sx={{
            width: "250px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
            zIndex: 900000000,
          }}>
          Not a valid token address!
        </Alert>
      )}
    </>
  );
};

export default TokenGatingModal;
