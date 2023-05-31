import { Alert, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import { useConnectWallet } from "@web3-onboard/react";
import { TokenGatingModalStyles } from "./TokenGatingModalStyles";
import useSmartContract from "../../hooks/useSmartContract";

const Backdrop = ({ onClick }) => {
  const classes = TokenGatingModalStyles();

  return <div onClick={onClick} className={classes.backdrop}></div>;
};

const TokenGatingModal = ({ closeModal, chooseTokens }) => {
  const [notValid, setNotValid] = useState(false);
  const [data, setData] = useState(null);
  const [{ wallet }] = useConnectWallet();
  const classes = TokenGatingModalStyles();

  const { erc20TokenContractCall } = useSmartContract({
    contractAddress: data && data?.address,
  });

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
      setData(values);
      let tokenSymbol,
        tokenDecimal = 0;
      if (values.address) {
        const checkTokenGating = async () => {
          try {
            if (data?.address) {
              tokenSymbol = await erc20TokenContractCall.obtainSymbol();
              try {
                tokenDecimal = await erc20TokenContractCall.decimals();
              } catch (err) {
                console.log(err);
              }

              chooseTokens({
                tokenSymbol: tokenSymbol,
                tokenAddress: values.address,
                tokenAmount: values.noOfTokens,
                tokenDecimal: tokenDecimal,
              });
              closeModal();
            }
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
              className={classes.input}
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
              className={classes.input}
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
