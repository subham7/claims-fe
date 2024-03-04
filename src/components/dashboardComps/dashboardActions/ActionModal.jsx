import React from "react";
import classes from "./ActionModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import {
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
// import Image from "next/image";

const ActionModal = () => {
  return (
    <Modal className={classes.modal}>
      <div className={classes.nameContainer}>
        <Typography fontSize={20} fontWeight={500} variant="inherit">
          Send <span>to another wallet</span>
        </Typography>
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
            placeholder="Choose asset"
            // value={currentEOAWallet}
            // onChange={currentEOAWalletChangeHandler}
            // renderValue={(selected) =>
            //   selected.walletName
            //     ? selected.walletName
            //     : shortAddress(selected.walletAddress)
            // }
            displayEmpty>
            <MenuItem>Hello</MenuItem>
            <MenuItem>Hello</MenuItem>
            <MenuItem>Hello</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={classes.stakeContainer}>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.input}
            placeholder="0"
            type={"number"}
            name="stakeAmount"
            id="stakeAmount"
            onWheel={(e) => e.target.blur()}
            // value={formik.values.stakeAmount}
            // onChange={formik.handleChange}
            // error={
            //   formik.touched.stakeAmount && Boolean(formik.errors.stakeAmount)
            // }
            // helperText={formik.touched.stakeAmount && formik.errors.stakeAmount}
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

      <div className={classes.recipientContainer}>
        <Typography fontSize={16} fontWeight={500} variant="inherit">
          Recipient
        </Typography>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.input}
            placeholder="Insert address or ENS"
            type={"text"}
            name="stakeAmount"
            id="stakeAmount"
            // value={formik.values.stakeAmount}
            // onChange={formik.handleChange}
            // error={
            //   formik.touched.stakeAmount && Boolean(formik.errors.stakeAmount)
            // }
            // helperText={formik.touched.stakeAmount && formik.errors.stakeAmount}
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

      <div>
        <Typography fontSize={16} fontWeight={500} variant="inherit">
          Note
        </Typography>
        <TextField
          name="note"
          id="note"
          //   value={formik.values.note}
          //   onChange={formik.handleChange}
          //   error={formik.touched.note && Boolean(formik.errors.note)}
          //   helperText={formik.touched.note && formik.errors.note}
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
        <button className={classes.cancel}>Cancel</button>
        <button className={classes.stake}>Done</button>
      </div>
    </Modal>
  );
};

export default ActionModal;
