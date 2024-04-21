import Modal from "@components/common/Modal/Modal";
import React, { useEffect, useState } from "react";
import classes from "./DepositCardModal.module.scss";
import { PiArrowElbowDownRightBold } from "react-icons/pi";
import UserInfo from "./UserInfo";
import AmountInfo from "./AmountInfo";
import ModalTitle from "./ModalTitle";
import { shortAddress } from "utils/helper";
import { useSelector } from "react-redux";
import { CHAIN_CONFIG } from "utils/constants";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { Typography } from "@mui/material";

const DepositCardModal = ({
  onClose,
  text,
  submitHandler,
  wallet,
  amount,
  networkId,
  isNative,
}) => {
  const [fees, setFees] = useState(0);
  const iconStyle = { fontWeight: 800, marginRight: "4px" };
  const club = useSelector((state) => state.club.clubData);
  const adminFee = (club.ownerFeePerDepositPercent * amount) / 10000;
  const { getDepositFees } = useCommonContractMethods();

  useEffect(() => {
    if (networkId === "0xe708") {
      (async () => {
        const depositFees = await getDepositFees(false);
        setFees(depositFees);
      })();
    }
  }, [networkId]);

  return (
    <Modal className={classes.modal}>
      <ModalTitle onClose={onClose} title="Join this station" />

      <div className={classes.userInputContainer}>
        <UserInfo
          name={club.name}
          wallet={shortAddress(wallet)}
          amount={`${amount} ${
            isNative ? CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol : "USDC"
          }`}
        />
      </div>

      <div className={classes.detailsContainer}>
        <AmountInfo
          title="Deposit"
          amount={`${Number(amount) - (adminFee ? adminFee : 0)} ${
            isNative ? CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol : "USDC"
          }`}
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />
        <AmountInfo
          title={`Admin Fee (${
            Number(club?.ownerFeePerDepositPercent) / 100
          }%)`}
          amount={`${adminFee} ${
            isNative ? CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol : "USDC"
          }`}
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />

        {networkId === "0xe708" ? (
          <AmountInfo
            title="Platform Fee"
            amount={`${fees} ${CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol}`}
            icon={<PiArrowElbowDownRightBold style={iconStyle} />}
          />
        ) : null}
      </div>

      <div className={classes.infoContainer}>
        <Typography className={classes.info} variant="inherit">
          This station is managed by the admin(s). Join the station onky if you
          trust the admin(s) with your funds.
        </Typography>
      </div>

      <button onClick={submitHandler} className={classes.confirmButton}>
        {text}
      </button>
    </Modal>
  );
};

export default DepositCardModal;
