import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../../../src/components/layouts/layout1";
import {
  Button,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { proposalDisplayOptions } from "../../../../src/data/dashboard";
import DocsCard from "../../../../src/components/proposalComps/DocsCard";
import CreateProposalDialog from "../../../../src/components/proposalComps/CreateProposalDialog";
import { fetchProposals } from "../../../../src/utils/proposal";
import { useRouter } from "next/router";
import ProposalCard from "../proposalsss/ProposalCard";
import { getAssetsByDaoAddress } from "../../../../src/api/assets";
import ClubFetch from "../../../../src/utils/clubFetch";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { setProposalList } from "../../../../src/redux/reducers/proposal";

const useStyles = makeStyles({
  noProposal_heading: {
    fontSize: "18px",
    fontWeight: "400",
    color: "white",
  },
  noProposal_para: {
    fontSize: "14px",
    fontWeight: "400",
    color: "lightgray",
  },
  noProposal: {
    width: "600px",
    margin: "0 auto",
    textAlign: "center",
    border: "1px solid #FFFFFF1A",
    borderRadius: "10px",
    padding: "10px 30px",
    marginTop: "50px",
  },
});

const Proposal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { clubId: daoAddress } = router.query;
  const classes = useStyles();

  const [selectedListItem, setSelectedListItem] = useState(
    proposalDisplayOptions[0].type,
  );

  const [open, setOpen] = useState(false);
  const [tokenData, setTokenData] = useState([]);

  const NETWORK_HEX = useSelector((state) => {
    return state.gnosis.networkHex;
  });

  const proposalList = useSelector((state) => {
    return state.proposal.proposalList;
  });

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isAdminUser = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(false);
    }
  };

  const handleProposalClick = (proposal) => {
    router.push(`${router.asPath}/${proposal?.proposalId}`, undefined, {
      shallow: true,
    });
  };

  const fetchTokens = useCallback(() => {
    console.log("daoAddress", daoAddress);
    if (daoAddress) {
      const tokenData = getAssetsByDaoAddress(daoAddress, NETWORK_HEX);
      tokenData.then((result) => {
        if (result?.status != 200) {
          console.log("error in token daata fetching");
        } else {
          setTokenData(result.data.tokenPriceList);
        }
      });
    }
  }, [NETWORK_HEX, daoAddress]);
  const fetchProposalList = async (type = "all") => {
    const data = await fetchProposals(daoAddress, type);

    console.log(data);
    dispatch(setProposalList(data));
  };

  const handleFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedListItem(value);
    fetchProposalList(value);
    console.log("value", value);
  };

  useEffect(() => {
    if (daoAddress) {
      fetchTokens();
    }
  }, [daoAddress, fetchTokens]);

  useEffect(() => {
    fetchProposalList();
  }, [daoAddress]);

  return (
    <Layout1 page={2}>
      <Grid container spacing={3} paddingLeft={10} paddingTop={15}>
        <Grid item md={8}>
          <Grid
            container
            mb={5}
            direction={{
              xs: "column",
              sm: "column",
              md: "column",
              lg: "row",
            }}
          >
            <Grid item>
              <Typography variant="title">WorkStation</Typography>
            </Grid>
            <Grid
              item
              xs
              sx={{
                display: { lg: "flex" },
                justifyContent: { md: "flex-center", lg: "flex-end" },
              }}
            >
              <Grid container direction="row" spacing={2}>
                <Grid
                  item
                  xs
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Select
                    sx={{ height: "80%", textTransform: "capitalize" }}
                    value={selectedListItem}
                    onChange={handleFilterChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return "Select a command";
                      }
                      return selected;
                    }}
                    MenuProps={proposalDisplayOptions}
                    style={{
                      borderRadius: "10px",
                      background: "#111D38 0% 0% no-repeat padding-box",
                      width: "30%",
                    }}
                  >
                    {proposalDisplayOptions.map((option) => (
                      <MenuItem
                        key={option.name}
                        value={option.type}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {isGovernanceActive ? (
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        height: "80%",
                      }}
                      onClick={handleClickOpen}
                    >
                      Propose
                    </Button>
                  </Grid>
                ) : isAdminUser ? (
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        height: "80%",
                      }}
                      onClick={handleClickOpen}
                    >
                      Propose
                    </Button>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {proposalList?.length > 0 ? (
                proposalList.map((proposal, key) => {
                  return (
                    <Grid
                      item
                      key={proposal.id}
                      onClick={(e) => {
                        handleProposalClick(proposalList[key]);
                      }}
                      md={12}
                    >
                      <ProposalCard
                        proposal={proposal}
                        indexKey={key}
                        // fetched={fetched}
                      />
                    </Grid>
                  );
                })
              ) : (
                <div className={classes.noProposal}>
                  <p className={classes.noProposal_heading}>
                    No Proposals found
                  </p>
                  <p className={classes.noProposal_para}>
                    Proposals inside your station will appear here.
                  </p>
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4}>
          <DocsCard />
        </Grid>
      </Grid>
      <CreateProposalDialog
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
        tokenData={tokenData}
      />
    </Layout1>
  );
};

export default ClubFetch(Proposal);
