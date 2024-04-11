import { Card, Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { proposalDetailsData } from "utils/proposalData";
import { isNative } from "utils/helper";
import { useNetwork } from "wagmi";
import { extractContractDetails } from "utils/proposalHelper";

const useStyles = makeStyles({
  listFont2: {
    fontSize: "18px",
    color: "#dcdcdc",
  },
  listFont2Colourless: {
    fontSize: "18px",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

const ProposalExecutionInfo = ({ proposalData, routeNetworkId }) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const classes = useStyles();

  const { getDecimals, getTokenSymbol } = useCommonContractMethods({
    routeNetworkId,
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const [proposalDetails, setProposalDetails] = useState({});

  const [tokenDetails, setTokenDetails] = useState({
    decimals: 0,
    symbol: "",
    amount: 0,
  });

  const { executionId } = proposalData?.commands[0];

  const fetchAirDropContractDetails = async () => {
    try {
      const contractDetails = await extractContractDetails(
        proposalData,
        clubData,
        networkId,
        getDecimals,
        getTokenSymbol,
        convertFromWeiGovernance,
      );
      if (contractDetails) {
        setTokenDetails(contractDetails);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAirDropContractDetails();
  }, [proposalData.commands[0], clubData, networkId]);

  const getProposalDetailsData = () => {
    const response = proposalDetailsData({
      data: proposalData?.commands[0],
      decimals: tokenDetails.decimals,
      symbol: tokenDetails.symbol,
      factoryData: clubData,
      isNativeClub: isNative(clubData.depositTokenAddress, networkId),
    });
    setProposalDetails(response);
  };

  useEffect(() => {
    getProposalDetailsData();
  }, [
    proposalData,
    tokenDetails.decimals,
    tokenDetails.symbol,
    clubData.depositTokenAddress,
    networkId,
  ]);

  return (
    <Grid item md={9}>
      {proposalData?.commands.length && !isNaN(Number(executionId)) ? (
        <Card>
          <>
            {proposalDetails.data && (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    {proposalDetails.title}
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    {Object.keys(proposalDetails?.data).map((key, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Typography className={classes.listFont2}>
                          {key}
                        </Typography>
                        <Typography className={classes.listFont2Colourless}>
                          {proposalDetails.data[key]}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </>
            )}
          </>
        </Card>
      ) : null}
    </Grid>
  );
};

export default ProposalExecutionInfo;
