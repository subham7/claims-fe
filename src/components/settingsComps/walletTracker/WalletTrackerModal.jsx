import Modal from "@components/common/Modal/Modal";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { IoIosClose } from "react-icons/io";
import classes from "./WalletTracker.module.scss";

const WalletTrackerModal = ({ onClose }) => {
  return (
    <Modal onClose={onClose} className={classes.walletTrackerModal}>
      <div className={classes.heading}>
        <Typography variant="inherit" fontSize={24} fontWeight={600}>
          Add new wallet
        </Typography>
        <IoIosClose onClick={onClose} size={28} />
      </div>

      <Typography
        className={classes.subtext}
        variant="inherit"
        fontSize={14}
        mt={1}>
        Add any of your community’s EOA wallets here, and you’ll be able to
        track their activity inside this station.
      </Typography>

      <form>
        <Typography variant="inherit" fontWeight={500} mt={2} mb={0.5}>
          Add wallet address*
        </Typography>
        <TextField className={classes.textFields} type="text" />
        <Typography variant="inherit" fontWeight={500} mt={2} mb={0.5}>
          Add name
        </Typography>
        <TextField
          sx={{
            fontFamily: "inherit",
          }}
          className={classes.textFields}
          type="text"
          placeholder="Wallet 1"
        />

        <Typography variant="inherit" fontWeight={500} mt={2} mb={0.5}>
          Network
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select
            sx={{
              fontFamily: "inherit",
            }}
            MenuProps={{
              style: {
                zIndex: 2004,
              },
            }}
            inputProps={{ "aria-label": "Without label" }}>
            <MenuItem
              sx={{
                fontFamily: "inherit",
              }}
              value={"bnb"}>
              Binance Smart Chain
            </MenuItem>
            <MenuItem
              sx={{
                fontFamily: "inherit",
              }}
              value={"polygon"}>
              Polygon (POS)
            </MenuItem>
            <MenuItem
              sx={{
                fontFamily: "inherit",
              }}
              value={"ethereum"}>
              Ethereum Mainnet
            </MenuItem>
          </Select>
        </FormControl>

        <Button className={classes.saveButton} variant="contained">
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default WalletTrackerModal;
