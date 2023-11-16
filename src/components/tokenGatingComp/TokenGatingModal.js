import { Button, Typography } from "@mui/material";
import { TextField } from "@components/ui";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { TokenGatingModalStyles } from "./TokenGatingModalStyles";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import BackdropLoader from "@components/common/BackdropLoader";
import { setAlertData } from "redux/reducers/general";
import { useDispatch } from "react-redux";

const TokenGatingModal = ({ closeModal, chooseTokens }) => {
  const classes = TokenGatingModalStyles();
  const dispatch = useDispatch();

  const { getTokenSymbol, getDecimals } = useCommonContractMethods();

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

            dispatch(
              setAlertData({
                open: true,
                message: "Not a valid token address!",
                severity: "error",
              }),
            );
          }
        };
        checkTokenGating();
      }
    },
  });

  return (
    <>
      <BackdropLoader isOpen={true} showLoading={false}>
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
                helperText={
                  formik.touched.noOfTokens && formik.errors.noOfTokens
                }
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
      </BackdropLoader>
    </>
  );
};

export default TokenGatingModal;
