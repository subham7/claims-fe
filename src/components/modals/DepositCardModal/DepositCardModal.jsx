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
import { CC_NETWORKS } from "utils/networkConstants";

const DepositCardModal = ({
  onClose,
  text,
  submitHandler,
  wallet,
  amount,
  networkId,
  isNative,
  routeNetworkId,
}) => {
  const [fees, setFees] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [depositTokenSymbol, setDepositTokenSymbol] = useState("");
  const iconStyle = { fontWeight: 800, marginRight: "4px" };
  const club = useSelector((state) => state.club.clubData);
  const adminFee = (club.ownerFeePerDepositPercent * amount) / 10000 ?? 0;
  const { getDepositFees, getTokenSymbol } = useCommonContractMethods();

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  useEffect(() => {
    if (CC_NETWORKS.includes(networkId)) {
      (async () => {
        const depositFees = await getDepositFees(false);

        setFees(depositFees);
      })();
    }

    (async () => {
      const tokenSymbol = await getTokenSymbol(clubData?.depositTokenAddress);
      setDepositTokenSymbol(tokenSymbol);
    })();
  }, [networkId, clubData?.depositTokenAddress]);

  return (
    <Modal className={classes.modal}>
      <ModalTitle onClose={onClose} title="Join this station" />
      <div className={classes.userInputContainer}>
        <UserInfo
          name={club.name}
          wallet={shortAddress(wallet)}
          amount={`${
            CC_NETWORKS.includes(routeNetworkId)
              ? Number(amount + adminFee).toFixed(4)
              : amount
          } ${depositTokenSymbol}`}
        />
      </div>

      <div className={classes.detailsContainer}>
        <AmountInfo
          title="Deposit"
          amount={`${
            CC_NETWORKS.includes(routeNetworkId)
              ? amount
              : Number(amount - adminFee).toFixed(4)
          } ${depositTokenSymbol}`}
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />
        <AmountInfo
          title={`Admin Fee (${
            Number(club?.ownerFeePerDepositPercent) / 100
          }%)`}
          amount={`${adminFee} ${depositTokenSymbol}`}
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />

        {CC_NETWORKS.includes(networkId) ? (
          <AmountInfo
            title="Platform Fee"
            amount={`${fees} ${CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol}`}
            icon={<PiArrowElbowDownRightBold style={iconStyle} />}
          />
        ) : null}
      </div>

      <div className={classes.infoContainer}>
        <Typography className={classes.info} variant="inherit">
          This station is managed by the admin(s). Join the station only if you
          trust the admin(s) with your funds.
        </Typography>
      </div>

      <div className={classes.checkBox}>
        <input
          checked={isChecked}
          onChange={() => {
            setIsChecked(!isChecked);
          }}
          type="checkbox"
        />
        <Typography variant="inherit">
          Yes, I trust the owner of this station to manage my funds
        </Typography>
      </div>

      <button
        disabled={!isChecked}
        onClick={submitHandler}
        className={classes.confirmButton}>
        {text}
      </button>
    </Modal>
  );
};

export default DepositCardModal;
