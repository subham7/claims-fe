import SafeImage from "@components/common/SafeImage";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import {
  customToFixedAutoPrecision,
  getDaysDifferenceDescription,
} from "utils/helper";
import Web3 from "web3";
import classes from "./Dashboard.module.scss";
import { getTransactionsByNetworkId } from "api/transactions";
import CopyLinkContainer from "./CopyLinkContainer";

const ActivityItem = ({ item, daoAddress, networkId }) => {
  const router = useRouter();

  const daysRemaining = getDaysDifferenceDescription(item.votingDuration);

  return (
    <div
      onClick={() =>
        router.push(`/proposals/${daoAddress}/${networkId}/${item.proposalId}`)
      }
      className={classes.proposal}>
      <Typography className={classes.itemTitle} variant="inherit">
        {item.name.length > 20 ? item.name.substring(0, 24) + ".." : item.name}
      </Typography>
      <Typography
        className={
          Number(daysRemaining) > 0 ? classes.proposalDate : classes.send
        }
        variant="inherit">
        {`${
          Number(daysRemaining) > 0
            ? `${daysRemaining} day(s) left`
            : "Finished"
        } `}
      </Typography>
    </div>
  );
};

const TransactionItem = ({ item }) => {
  const logoUri = item?.tokenInfo?.logoUri;
  const symbol = item?.tokenInfo?.name;
  const value = convertFromWeiGovernance(
    item?.value ?? 0,
    item?.tokenInfo?.decimals ?? 0,
  );

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  return (
    <div className={classes.transaction}>
      <div>
        <SafeImage
          src={logoUri}
          alt="logo"
          fallbackSrc={"/assets/icons/testToken.png"}
          height={25}
          width={25}
        />
        <Typography className={classes.itemTitle} variant="inherit">
          {symbol}
        </Typography>
      </div>
      <Typography
        className={
          item.to.toLowerCase() === gnosisAddress?.toLowerCase()
            ? classes.deposit
            : classes.send
        }
        variant="inherit">
        {item.to.toLowerCase() === gnosisAddress?.toLowerCase() ? "+" : "-"}
        {customToFixedAutoPrecision(Number(value))}
      </Typography>
    </div>
  );
};

const DashboardActivities = ({ proposals, daoAddress, networkId }) => {
  const [allTransactions, setAllTransactions] = useState([]);

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const fetchTransactions = async () => {
    try {
      const { transfers } = await getTransactionsByNetworkId(
        Web3.utils.toChecksumAddress(gnosisAddress),
        networkId,
      );
      setAllTransactions(transfers?.slice(0, 10));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (gnosisAddress) {
      fetchTransactions();
    }
    // eslint-disable-next-line
  }, [gnosisAddress]);

  return (
    <div className={classes.rightContainer}>
      <CopyLinkContainer daoAddress={daoAddress} routeNetworkId={networkId} />
      {/* {[
        {
          title: "Latest Activity",
          data: proposals,
          isTransaction: false,
        },
        {
          title: "Latest Transactions",
          data: allTransactions,
          isTransaction: true,
        },
      ].map(({ title, data, isTransaction }) => (
        <div
          className={
            isTransaction
              ? classes.transactionContainer
              : classes.activityContainer
          }
          key={title}>
          <Typography className={classes.heading} variant="inherit">
            {title}
          </Typography>
          <div
            className={
              isTransaction ? classes.transactionList : classes.proposalList
            }>
            {data?.length ? (
              data.map((item, index) =>
                isTransaction ? (
                  item && <TransactionItem key={index} item={item} />
                ) : (
                  <ActivityItem
                    key={index}
                    item={item}
                    daoAddress={daoAddress}
                    networkId={networkId}
                  />
                ),
              )
            ) : (
              <Typography className={classes.noActivity} variant="inherit">
                No {isTransaction ? "Transactions" : "Activity"} yet!
              </Typography>
            )}
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default DashboardActivities;
