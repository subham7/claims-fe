import classes from "./DepositPreRequisites.module.scss";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Typography } from "@mui/material";
import Link from "next/link";
import DoneIcon from "@mui/icons-material/Done";
import { useEffect, useState } from "react";
import UploadDocModal from "@components/modals/UploadDocModal";
import { fetchClubByDaoAddress } from "api/club";
import { hasUserSigned } from "api/deposit";
import { useAccount } from "wagmi";

const DepositPreRequisites = ({
  daoAddress,
  uploadedDocInfo,
  onIsSignedChange,
  onIsW8BenSignedChange,
}) => {
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isW8BenSigned, setIsW8BenSigned] = useState(false);
  const [depositConfig, setDepositConfig] = useState(null);
  const [shouldRerender, setShouldRerender] = useState(false);

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

      setIsSigned(res?.signature);
    } else {
      const res = await hasUserSigned(docIdentifier, walletAddress, true);

      if (res) {
        setIsW8BenSigned(true);
      }
    }
  };

  const handleModalClose = () => {
    setShowUploadDocModal(false);
    setShouldRerender(true);
  };

  useEffect(() => {
    if (daoAddress) {
      getDepositPreRequisites(daoAddress);
      if (depositConfig?.subscriptionDocId !== null) {
        userSigned(depositConfig?.subscriptionDocId, walletAddress);
      } else {
        setIsSigned(true);
        // setIsW8BenSigned(true);
      }

      if (depositConfig?.uploadDocId !== null) {
        userSigned(
          depositConfig?.uploadDocId,
          walletAddress.toLowerCase(),
          true,
        );
      } else {
        // setIsSigned(true);

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

  return (
    <>
      {depositConfig &&
        (depositConfig?.subscriptionDocId !== null ||
          depositConfig?.enableKyc === true ||
          depositConfig?.uploadDocId !== null) && (
          <div className={classes.mainContainer}>
            <Typography variant="subtitle1">Complete these steps</Typography>
            {depositConfig?.subscriptionDocId !== null && (
              <Link
                style={{
                  display: "inline-block",
                }}
                href={`/documents/${daoAddress}/0x89/sign/${depositConfig?.subscriptionDocId}`}>
                <div className={classes.stepContainer}>
                  {isSigned ? (
                    <DoneIcon className={classes.tickIcon} />
                  ) : (
                    <RadioButtonUncheckedIcon className={classes.icons} />
                  )}

                  <div style={{ marginRight: "0.5rem" }}>
                    Sign subscription agreement
                  </div>
                  <OpenInNewIcon className={classes.icons} />
                </div>
              </Link>
            )}

            {depositConfig && depositConfig?.enableKyc ? (
              <div className={classes.stepContainer}>
                <RadioButtonUncheckedIcon className={classes.icons} />
                <div style={{ marginRight: "0.5rem" }}>Complete KYC</div>
                <OpenInNewIcon className={classes.icons} />
              </div>
            ) : null}

            {depositConfig && depositConfig?.uploadDocId !== null && (
              <div
                style={{
                  width: "fit-content",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowUploadDocModal(true);
                }}
                className={classes.stepContainer}>
                {isW8BenSigned ? (
                  <DoneIcon className={classes.tickIcon} />
                ) : (
                  <RadioButtonUncheckedIcon className={classes.icons} />
                )}
                <div style={{ marginRight: "0.5rem" }}>Upload w8ben</div>
                <OpenInNewIcon className={classes.icons} />
              </div>
            )}
          </div>
        )}

      {showUploadDocModal && (
        <UploadDocModal
          uploadDocIdentifier={uploadedDocInfo?.docIdentifier}
          onClose={handleModalClose}
          downloadUrl={uploadedDocInfo?.docLink}
          daoAddress={daoAddress}
        />
      )}
    </>
  );
};

export default DepositPreRequisites;
