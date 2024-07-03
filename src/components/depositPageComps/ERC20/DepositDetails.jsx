import { Typography } from "@mui/material";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import classes from "../../claims/Claim.module.scss";
import { formatNumbers } from "utils/helper";
import { CHAIN_CONFIG } from "utils/constants";
import AvatarGroup from "@mui/material/AvatarGroup";
import { fetchSafeAdmins } from "api/safe";

const DepositDetails = () => {
  const [adminAddresses, setAdminAddresses] = useState([]);

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const router = useRouter();
  const [_, networkId = "0x89"] = router?.query?.slug ?? [];
  const blockExplorerUrl = CHAIN_CONFIG[networkId]?.blockExplorerUrl;

  const {
    minDepositAmountFormatted,
    maxDepositAmountFormatted,
    depositTokenSymbol,
  } = clubData;
  const displayAddresses = adminAddresses?.slice(0, 4);
  const additionalCount = adminAddresses?.length - 4;

  const fetchStationAdmins = async () => {
    try {
      const admins = await fetchSafeAdmins({
        gnosisAddress: clubData?.gnosisAddress,
        networkId,
      });
      setAdminAddresses(admins);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (clubData?.gnosisAddress) fetchStationAdmins();
  }, [clubData?.gnosisAddress]);

  return (
    <div>
      <div className={classes.detailContainer}>
        <div className={classes.detailCard}>
          <Typography fontSize={14} fontWeight={400} color={"#707070"}>
            Minimum
          </Typography>
          <Typography
            fontSize={16}
            mt={0.4}
            fontWeight={600}
            color={"white"}
            variant="inherit">
            {formatNumbers(Number(minDepositAmountFormatted?.formattedValue))}{" "}
            {depositTokenSymbol}
          </Typography>
        </div>
        <div className={classes.detailCard}>
          <Typography fontSize={14} fontWeight={400} color={"#707070"}>
            Maximum
          </Typography>
          <Typography
            fontSize={16}
            mt={0.4}
            fontWeight={600}
            color={"white"}
            variant="inherit">
            {formatNumbers(Number(maxDepositAmountFormatted?.formattedValue))}{" "}
            {depositTokenSymbol}
          </Typography>
        </div>
        <div className={classes.detailCard}>
          <Typography fontSize={14} fontWeight={400} color={"#707070"}>
            Admin(s)
          </Typography>
          <Typography
            fontSize={16}
            mt={0.4}
            fontWeight={600}
            color={"white"}
            variant="inherit">
            <AvatarGroup className={classes.avatarGroup}>
              {adminAddresses &&
                displayAddresses.map((addr, ind) => {
                  return (
                    <Tooltip title={addr} key={ind}>
                      <div>
                        <a
                          target="_blank"
                          href={blockExplorerUrl + "/address/" + addr}
                          rel="noopener noreferrer">
                          <MetaMaskAvatar address={addr} />
                        </a>
                      </div>
                    </Tooltip>
                  );
                })}
              {additionalCount > 0 && (
                <div className={classes.avatarAdditional}>
                  <p>+{additionalCount}</p>
                </div>
              )}
            </AvatarGroup>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DepositDetails;
