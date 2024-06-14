import { useTheme } from "@mui/styles";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import React, { useEffect, useState } from "react";
import { ZERO_ADDRESS } from "utils/constants";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ClaimEligibility = ({
  minWhitelistTokenValue,
  whitelistTokenAddress,
  routeNetworkId,
}) => {
  const [whitelistTokenData, setWhitelistTokenData] = useState({
    decimals: 0,
    symbol: "",
  });

  const theme = useTheme();
  const classes = ClaimsInsightStyles(theme);
  const { getDecimals, getTokenSymbol, checkTokenIsErc1155, getTokenName } =
    useCommonContractMethods({ routeNetworkId });

  useEffect(() => {
    const fetchWhiteListTokenDetails = async () => {
      const tokenIsErc1155 = await checkTokenIsErc1155(whitelistTokenAddress);
      const symbol = tokenIsErc1155
        ? await getTokenName(whitelistTokenAddress)
        : await getTokenSymbol(whitelistTokenAddress);

      let decimals;

      try {
        decimals = await getDecimals(whitelistTokenAddress);
      } catch (error) {
        console.log(error);
      }

      setWhitelistTokenData({
        decimals: decimals,
        symbol,
      });
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

      {whitelistTokenAddress !== ZERO_ADDRESS ? (
        <>
          <div className={classes.eligibleToken}>
            <p>
              {whitelistTokenData?.decimals
                ? convertFromWeiGovernance(
                    minWhitelistTokenValue,
                    whitelistTokenData.decimals,
                  )
                : minWhitelistTokenValue}
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
