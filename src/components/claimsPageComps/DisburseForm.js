import {
  FormControl,
  InputAdornment,
  MenuItem,
  Typography,
} from "@mui/material";
import { Button, TextField } from "@components/ui";
import { BsArrowLeft } from "react-icons/bs";
import { makeStyles } from "@mui/styles";
import React from "react";
import { useRouter } from "next/router";
import { convertFromWeiGovernance } from "utils/globalFunctions";

const useStyles = makeStyles({
  form: {
    display: "flex-col",
    alignItems: "center",
    justifyContent: "center",
    margin: "40px auto",
    width: "600px",
    color: "white",
  },
  title: {
    fontSize: "36px",
    fontWeight: "400",
    marginBottom: "40px",
  },
  label: {
    marginTop: "30px",
    fontWeight: "300",
    marginBottom: "4px",
  },
  btn: {
    width: "130px",

    fontSize: "16px",
    marginTop: "20px",
  },
  text: {
    color: "#6475A3",
    fontSize: "14px",
    marginTop: "8px",
  },
  back: {
    fontWeight: "300",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#dcdcdc",
    position: "absolute",
    left: "10%",
    top: "110px",
    fontSize: "18px",
    cursor: "pointer",
  },
});

const DisburseForm = ({ formik, tokensInWallet, isLoading }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      <Typography
        onClick={() => {
          router.push(`/claims/`);
        }}
        className={classes.back}>
        <BsArrowLeft /> Back to claims
      </Typography>

      <form className={classes.form}>
        <Typography className={classes.title}>Disburse Tokens</Typography>

        {/* Choose Token */}
        <Typography className={classes.label}>
          Choose token to airdrop *
        </Typography>
        <Typography className={classes.text}>
          You can choose any token held in your wallet connected to StationX
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment
                  style={{ color: "#6475A3", marginRight: "20px" }}
                  position="end">
                  Balance:{" "}
                  {formik.values.selectedToken
                    ? convertFromWeiGovernance(
                        formik.values.selectedToken.balance,
                        formik.values.selectedToken.decimals,
                      )
                    : "0"}
                </InputAdornment>
              ),
            }}
            disabled={isLoading}
            variant="outlined"
            name="selectedToken"
            id="selectedToken"
            value={formik.values.selectedToken}
            onChange={formik.handleChange}
            placeholder="Loading Tokens..."
            select
            error={
              formik.touched.selectedToken &&
              Boolean(formik.errors.selectedToken)
            }
            helperText={
              formik.touched.selectedToken && formik.errors.selectedToken
            }>
            {tokensInWallet?.map((token, i) => (
              <MenuItem key={i} value={token}>
                {token?.symbol}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        <Typography className={classes.label}>
          Enter wallet addresses, and amount *
        </Typography>
        <FormControl sx={{ width: "100%", marginBottom: "32px" }}>
          <TextField
            variant="outlined"
            name="disburseList"
            id="disburseList"
            value={formik.values.disburseList}
            onChange={formik.handleChange}
            placeholder="0x5aC09Ca0865B5492a82460acb43ce658Ea6163D2, 2"
            multiline
            error={
              formik.touched.disburseList && Boolean(formik.errors.disburseList)
            }
            helperText={
              formik.touched.disburseList && formik.errors.disburseList
            }
          />
        </FormControl>

        <Button onClick={formik.handleSubmit}>Finish</Button>
      </form>
    </>
  );
};

export default DisburseForm;
