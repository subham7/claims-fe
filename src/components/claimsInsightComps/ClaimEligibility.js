import React, { useEffect, useState } from "react";
import useSmartContractMethods from "../../hooks/useSmartContractMethods";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ClaimEligibility = ({
  minWhitelistTokenValue,
  whitelistTokenAddress,
}) => {
  const [whitelistTokenData, setWhitelistTokenData] = useState({
    decimals: 0,
    symbol: "",
  });

  const classes = ClaimsInsightStyles();
  const { getDecimals, getTokenSymbol } = useSmartContractMethods();

  useEffect(() => {
    const fetchWhiteListTokenDetails = async () => {
      try {
        let decimals;
        const symbol = await getTokenSymbol(whitelistTokenAddress);
        try {
          decimals = await getDecimals(whitelistTokenAddress);
        } catch (error) {
          console.log(error);
        }

        setWhitelistTokenData({
          decimals: decimals ? decimals : 1,
          symbol,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchWhiteListTokenDetails();
  }, [whitelistTokenAddress]);

  return (
    <div className={classes.eligibilityContainer}>
      <div className={classes.flexContainer}>
        <p>Conditions for eligibility</p>
        {/* <BsPencil
          style={{
            border: "0.5px solid #6475A3",
            padding: "5px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          size={25}
        /> */}
      </div>

      {whitelistTokenAddress !==
      "0x0000000000000000000000000000000000000000" ? (
        <>
          <div className={classes.eligibleToken}>
            <p>
              {convertFromWeiGovernance(
                minWhitelistTokenValue,
                whitelistTokenData.decimals,
              )}
            </p>

            <p>{whitelistTokenData.symbol}</p>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            height: "90%",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <p
            style={{
              color: "lightgray",
            }}>
            No conditions available!
          </p>
        </div>
      )}
    </div>
  );
};

export default ClaimEligibility;
