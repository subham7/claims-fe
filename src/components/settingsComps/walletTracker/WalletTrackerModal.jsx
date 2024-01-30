import BackdropLoader from "@components/common/BackdropLoader";
import Modal from "@components/common/Modal/Modal";
import { eoaWalletTrackerValidation } from "@components/createClubComps/ValidationSchemas";
import { Button, TextField, Typography } from "@mui/material";
import { addWalletAddressToTrack } from "api/club";
import { useFormik } from "formik";
import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { handleSignMessage } from "utils/helper";
import { useAccount } from "wagmi";
import classes from "./WalletTracker.module.scss";

const WalletTrackerModal = ({ onClose, daoAddress, onAddSuccess }) => {
  const [loading, setLoading] = useState(false);

  const { address: walletAddress } = useAccount();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      walletAddress: "",
      walletName: "",
    },
    validationSchema: eoaWalletTrackerValidation,
    onSubmit: async (value) => {
      try {
        setLoading(true);
        const data = {
          walletName: value.walletName,
          walletAddress: value.walletAddress,
        };

        const { signature } = await handleSignMessage(
          walletAddress,
          JSON.stringify(data),
        );

        const res = await addWalletAddressToTrack(
          {
            ...data,
            signature,
          },
          daoAddress,
        );

        setLoading(false);

        onClose();
        onAddSuccess();
        dispatch(
          setAlertData({
            open: true,
            message: "Wallet added successfully!",
            severity: "success",
          }),
        );
      } catch (error) {
        setLoading(false);
        dispatch(
          setAlertData({
            open: true,
            message: "Unable to add wallet!",
            severity: "error",
          }),
        );
        console.log(error);
      }
    },
  });

  return (
    <>
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

        <form onSubmit={formik.handleSubmit}>
          <Typography variant="inherit" fontWeight={500} mt={2} mb={0.5}>
            Add wallet address *
          </Typography>
          <TextField
            InputProps={{
              style: {
                fontFamily: "inherit",
              },
            }}
            className={classes.textFields}
            type="text"
            placeholder="0x"
            name="walletAddress"
            id="walletAddress"
            value={formik.values.walletAddress}
            onChange={formik.handleChange}
            error={
              formik.touched.walletAddress &&
              Boolean(formik.errors.walletAddress)
            }
            helperText={
              formik.touched.walletAddress && formik.errors.walletAddress
            }
          />
          <Typography variant="inherit" fontWeight={500} mt={2} mb={0.5}>
            Add name
          </Typography>
          <TextField
            InputProps={{
              style: {
                fontFamily: "inherit",
              },
            }}
            className={classes.textFields}
            type="text"
            placeholder="Wallet 1"
            name="walletName"
            id="walletName"
            value={formik.values.walletName}
            onChange={formik.handleChange}
            error={
              formik.touched.walletName && Boolean(formik.errors.walletName)
            }
            helperText={formik.touched.walletName && formik.errors.walletName}
          />

          <Button
            type="submit"
            className={classes.saveButton}
            variant="contained">
            Save
          </Button>
        </form>
        <BackdropLoader isOpen={loading} />
      </Modal>
    </>
  );
};

export default WalletTrackerModal;
