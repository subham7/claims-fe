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

      {/* <div className={classes.recipientContainer}>
        <Typography fontSize={16} fontWeight={500} variant="inherit">
          Recipient
        </Typography>
        <TextField
          name="note"
          id="note"
          placeholder="Insert address or ENS"
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
          className={classes.note}
        />
      </div> */}

      <div>
        <FormControl sx={{ minWidth: 150 }}>
          <Select
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              fontFamily: "inherit",
              backgroundColor: "inherit",
            }}
            // value={currentEOAWallet}
            // onChange={currentEOAWalletChangeHandler}
            // renderValue={(selected) =>
            //   selected.walletName
            //     ? selected.walletName
            //     : shortAddress(selected.walletAddress)
            // }
            displayEmpty>
            {allEOAWallets?.map((wallet) => (
              <MenuItem
                key={`${wallet.walletAddress}${wallet.networkId}`}
                sx={{
                  fontFamily: "inherit",
                }}
                value={wallet}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "4px",
                  }}>
                  <Typography variant="inherit" fontSize={14}>
                    {wallet.walletName
                      ? wallet.walletName
                      : shortAddress(wallet.walletAddress)}
                  </Typography>
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
    </Modal>
  );
};

export default ActionModal;
