import { Typography } from "@mui/material";
import { Tooltip } from "@mui/material";
import React from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import classes from "../../claims/Claim.module.scss";
import { formatNumbers } from "utils/helper";
import { CHAIN_CONFIG } from "utils/constants";
import { Avatar } from "antd";
const DepositDetails = () => {
  const clubData = useSelector((state) => {
    return state.club.clubData;
  });
  const adminAddresses = clubData?.adminAddresses;
  const router = useRouter();
  const [_, networkId = "0x89"] = router?.query?.slug ?? [];
  const blockExplorerUrl = CHAIN_CONFIG[networkId]?.blockExplorerUrl;

  const {
    minDepositAmountFormatted,
    maxDepositAmountFormatted,
    depositTokenSymbol,
  } = clubData;

  console.log("Minor bug");
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
            <Avatar.Group
              size="small"
              max={{
                count: 3,
                style: { color: "#f56a00", backgroundColor: "#fde3cf" },
                popover: { trigger: "null" },
              }}>
              {adminAddresses &&
                adminAddresses.map((addr, ind) => {
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
            </Avatar.Group>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DepositDetails;
