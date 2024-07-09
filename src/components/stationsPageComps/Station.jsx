/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";
import classes from "./Stations.module.scss";
import Image from "next/image";
import Web3 from "web3";
import { SlOptionsVertical } from "react-icons/sl";
import { CHAIN_CONFIG, GRADIENT_BUCKET } from "utils/constants";
import { useDispatch } from "react-redux";
import { addClubData } from "redux/reducers/club";
import { queryStationDataFromSubgraph } from "utils/stationsSubgraphHelper";
import { convertToFullNumber } from "utils/helper";
import { useRouter } from "next/router";
import useAppContractMethods from "hooks/useAppContractMethods";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { BigNumber } from "bignumber.js";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { setAlertData } from "redux/reducers/alert";

const Station = ({ club, idx }) => {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { getDaoDetails } = useAppContractMethods();
  const { getDecimals, getTokenSymbol } = useCommonContractMethods();
  const randomIndex = Math.floor(Math.random() * 12);

  const handleItemClick = async (daoAddress, networkId) => {
    try {
      const clubData = await queryStationDataFromSubgraph(
        daoAddress,
        networkId,
      );
      const daoDetails = await getDaoDetails(daoAddress);

      const depositTokenDecimal = await getDecimals(
        daoDetails.depositTokenAddress,
      );
      const depositTokenSymbol = await getTokenSymbol(
        daoDetails.depositTokenAddress,
      );

      if (clubData?.stations?.length)
        dispatch(
          addClubData({
            gnosisAddress: clubData.stations[0].gnosisAddress,
            isGtTransferable: clubData.stations[0].isGtTransferable,
            name: clubData.stations[0].name,
            ownerAddress: clubData.stations[0].ownerAddress,
            symbol: clubData.stations[0].symbol,
            tokenType: clubData.stations[0].tokenType,
            membersCount: clubData.stations[0].membersCount,
            deployedTime: clubData.stations[0].timeStamp,
            imgUrl: clubData.stations[0].imageUrl,
            minDepositAmount: clubData.stations[0].minDepositAmount,
            maxDepositAmount: clubData.stations[0].maxDepositAmount,
            pricePerToken: clubData.stations[0].pricePerToken,
            isGovernanceActive: clubData.stations[0].isGovernanceActive,
            quorum: clubData.stations[0].quorum,
            threshold: clubData.stations[0].threshold,
            raiseAmount: clubData.stations[0].raiseAmount,
            totalAmountRaised: clubData.stations[0].totalAmountRaised,
            maxTokensPerUser: clubData.stations[0].maxTokensPerUser,
            depositTokenDecimal,
            depositTokenSymbol,
            ...daoDetails,

            raiseAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].raiseAmount,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].raiseAmount,
              bigNumberValue: BigNumber(clubData.stations[0].raiseAmount),
            },

            totalAmountRaisedFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].totalAmountRaised,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].totalAmountRaised,
              bigNumberValue: BigNumber(clubData.stations[0].totalAmountRaised),
            },

            distributionAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                daoDetails.distributionAmount.toString(),
                18,
              ),
              actualValue: daoDetails.distributionAmount.toString(),
              bigNumberValue: BigNumber(
                daoDetails.distributionAmount.toString(),
              ),
            },

            minDepositAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].minDepositAmount,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].minDepositAmount,
              bigNumberValue: BigNumber(clubData.stations[0].minDepositAmount),
            },

            maxDepositAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].maxDepositAmount,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].maxDepositAmount,
              bigNumberValue: BigNumber(clubData.stations[0].maxDepositAmount),
            },

            pricePerTokenFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].pricePerToken,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].pricePerToken,
              bigNumberValue: BigNumber(clubData.stations[0].pricePerToken),
            },

            distributionAmount: convertToFullNumber(
              daoDetails.distributionAmount.toString(),
            ),
          }),
        );
      router.push(
        `/dashboard/${Web3.utils.toChecksumAddress(daoAddress)}/${networkId}`,
        undefined,
        {
          shallow: true,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={classes.station}
      onClick={() => {
        handleItemClick(club.daoAddress, club.networkId);
      }}>
      <Image
        src={CHAIN_CONFIG[club.networkId]?.logoUri}
        alt={CHAIN_CONFIG[club.networkId]?.shortName}
        width={10}
        height={10}
        className={classes.chainIcon}
      />
      {club?.clubLogoUrl ? (
        <img
          src={club.clubLogoUrl}
          alt="stationImage"
          width={50}
          height={50}
          className={classes.stationImage}
        />
      ) : (
        <span
          style={{
            width: "3.5rem",
            height: "3.5rem",
            background: GRADIENT_BUCKET[randomIndex],
            borderRadius: "0.6375rem",
            objectFit: "cover",
          }}></span>
      )}
      <div className={classes.stationInfo}>
        <div className={classes.stationHeader}>
          <h1 className={classes.stationTitle}>
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
              {club.name}
            </p>{" "}
            <span className={classes.stationBadge}>
              {club.tokenType === "erc721" ? "NFT" : club.tokenType}
            </span>
          </h1>
          <p className={classes.stationMetadata}>
            {club.isAdmin && "⚡️ Admin •"} {`${club.tokenTicker} •`}{" "}
            {club.membersCount} {club.membersCount > 1 ? "members" : "member"}
          </p>
        </div>
        <span className={classes.stationFunding}>
          {club.depositTokenAddress?.toLowerCase() ===
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ? convertFromWeiGovernance(
                Number(club.totalAmountRaised.replace(/,/g, "")),
                18,
              )
            : Number(club.totalAmountRaised.replace(/,/g, "")).toFixed(2)}{" "}
          {club.depositTokenAddress?.toLowerCase() ===
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? (
            <p>ETH</p>
          ) : (
            <p>USDC</p>
          )}
        </span>
      </div>
      <div className={classes.option} ref={dropdownRef}>
        <div
          className={classes.optionButton}
          onClick={(event) => {
            event.stopPropagation();
            setSelectedIndex((prevIndex) => (prevIndex === idx ? null : idx));
          }}>
          <SlOptionsVertical />
        </div>
        {selectedIndex === idx && (
          <div className={classes.optionDropdown}>
            <button
              className={classes.optionDropdownButton}
              onClick={() => {
                setSelectedIndex(null);
                router.push(`/join/${club.daoAddress}/${club.networkId}`);
              }}>
              Joining Page
            </button>
            <button
              className={classes.optionDropdownButton}
              onClick={() => {
                setSelectedIndex(null);
                navigator.clipboard.writeText(club.gnosisAddress);
                dispatch(
                  setAlertData({
                    open: true,
                    message: "Copied!",
                    severity: "success",
                  }),
                );
              }}>
              Copy Treasury Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Station;
