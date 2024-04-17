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
    (async () => {
      const depositFees = await getDepositFees(false);
      setFees(depositFees);
    })();
  }, []);

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
          amount={`${amount} ${
            isNative ? CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol : "USDC"
          }`}
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />
        <AmountInfo
          title={`Admin Fee (${club?.ownerFeePerDepositPercent}%)`}
          amount={`${adminFee} ${
            isNative ? CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol : "USDC"
          }`}
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />
        <AmountInfo
          title="StationX Fee"
          amount={`${fees} ${CHAIN_CONFIG[networkId]?.nativeCurrency?.symbol}`}
          icon={<PiArrowElbowDownRightBold style={iconStyle} />}
        />
      </div>

      <button onClick={submitHandler} className={classes.confirmButton}>
        {text}
      </button>
    </Modal>
  );
};

export default DepositCardModal;
