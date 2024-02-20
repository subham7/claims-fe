import classes from "./DepositPreRequisites.module.scss";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { useEffect, useState } from "react";
import UploadDocModal from "@components/modals/UploadDocModal";
import { fetchClubByDaoAddress } from "api/club";
import { hasUserSigned } from "api/deposit";
import { useAccount } from "wagmi";
import { AiFillInfoCircle } from "react-icons/ai";

const DepositPreRequisites = ({
  daoAddress,
  uploadedDocInfo,
  onIsSignedChange,
  onIsW8BenSignedChange,
}) => {
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [isSigned, setIsSigned] = useState();
  const [isW8BenSigned, setIsW8BenSigned] = useState(false);
  const [depositConfig, setDepositConfig] = useState(null);

  const { address: walletAddress } = useAccount();

  const getDepositPreRequisites = async (daoAddress) => {
    const res = await fetchClubByDaoAddress(daoAddress?.toLowerCase());
    setDepositConfig(res?.data?.depositConfig);
  };

  const userSigned = async (
    docIdentifier,
    walletAddress,
    isUploadDoc = false,
  ) => {
    if (!isUploadDoc) {
      const res = await hasUserSigned(docIdentifier, walletAddress);
      setIsSigned(res?.signature ? res?.signature : false);
    } else {
      const res = await hasUserSigned(docIdentifier, walletAddress, true);

      if (res) {
        setIsW8BenSigned(true);
      }
    }
  };

  useEffect(() => {
    if (daoAddress && walletAddress) {
      getDepositPreRequisites(daoAddress);
      if (depositConfig?.subscriptionDocId !== null) {
        userSigned(depositConfig?.subscriptionDocId, walletAddress);
      } else {
        setIsSigned(true);
      }

      if (depositConfig?.uploadDocId !== null) {
        userSigned(
          depositConfig?.uploadDocId,
          walletAddress?.toLowerCase(),
          true,
        );
      } else {
        setIsW8BenSigned(true);
      }
    }

    onIsSignedChange(isSigned);
    onIsW8BenSignedChange(isW8BenSigned);
  }, [
    daoAddress,
    depositConfig?.subscriptionDocId,
    depositConfig?.uploadDocId,
    isSigned,
    isW8BenSigned,
    walletAddress,
  ]);

  if (
    !depositConfig ||
    (depositConfig?.subscriptionDocId === null &&
      depositConfig?.enableKyc === false &&
      depositConfig?.uploadDocId === null)
  ) {
    return;
  }

  return (
    <>
      <div className={classes.mainContainer}>
        <div className={classes.warningContainer}>
          <AiFillInfoCircle size={20} />
          <Typography variant="inherit">
            Complete these steps to join this station
          </Typography>
        </div>
        {depositConfig?.subscriptionDocId !== null && (
          <div className={classes.stepContainer}>
            {isSigned ? (
              <DoneIcon className={classes.tickIcon} />
            ) : (
              <RadioButtonUncheckedIcon className={classes.icons} />
            )}

            <div
              className={classes.signTextDiv}
              onClick={() => {
                !isSigned &&
                  window.open(
                    `/documents/${daoAddress}/0x89/sign/${depositConfig?.subscriptionDocId}`,
                    "_blank",
                  );
              }}>
              <div style={{ marginRight: "0.5rem" }}>
                Sign subscription agreement
              </div>
              <OpenInNewIcon className={classes.icons} />
            </div>
          </div>
        )}

        {depositConfig && depositConfig?.uploadDocId !== null && (
          <div
            className={classes.signTextDiv}
            onClick={() => {
              {
                !isW8BenSigned && setShowUploadDocModal(true);
              }
            }}>
            {isW8BenSigned ? (
              <DoneIcon className={classes.tickIcon} />
            ) : (
              <RadioButtonUncheckedIcon className={classes.icons} />
            )}
            <div style={{ marginRight: "0.5rem" }}>Upload w8ben</div>
            <OpenInNewIcon className={classes.icons} />
          </div>
        )}

        {depositConfig && depositConfig?.enableKyc ? (
          <div className={classes.stepContainer}>
            <DoneIcon className={classes.tickIcon} />
            <div style={{ marginRight: "0.5rem" }}>Complete KYC</div>
            <OpenInNewIcon className={classes.icons} />
          </div>
        ) : null}
      </div>

      {showUploadDocModal ? (
        <UploadDocModal
          uploadDocIdentifier={uploadedDocInfo?.docIdentifier}
          onClose={(docId) => {
            userSigned(docId, walletAddress.toLowerCase(), true);
            setShowUploadDocModal(false);
          }}
          downloadUrl={uploadedDocInfo?.docLink}
          daoAddress={daoAddress}
        />
      ) : null}
    </>
  );
};

export default DepositPreRequisites;
