import React, { useEffect, useState } from "react";
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

const Proposal = () => {
  const router = useRouter();
  const { clubId: daoAddress } = router.query;

  const [selectedListItem, setSelectedListItem] = useState(
    proposalDisplayOptions[0].type,
  );

  const [proposalList, setProposalList] = useState();
  const [open, setOpen] = useState(false);
  const [tokenData, setTokenData] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(false);
    }
  };

  const handleProposalClick = (proposal) => {
    router.push(`${router.asPath}/${proposal.proposalId}`, undefined, {
      shallow: true,
    });
  };

  const fetchProposalList = async () => {
    const data = await fetchProposals(daoAddress);
    console.log(data);

    setProposalList(data);
  };

  const fetchTokens = () => {
    console.log("daoAddress", daoAddress);
    if (daoAddress) {
      const tokenData = getAssetsByDaoAddress(daoAddress);
      tokenData.then((result) => {
        if (result.status != 200) {
          console.log("error in token daata fetching");
        } else {
          setTokenData(result.data.tokenPriceList);
        }
      });
    }
  };

  useEffect(() => {
    if (daoAddress) {
      fetchProposalList();
      fetchTokens();
    }
  }, [daoAddress]);

  return (
    <Layout1 page={2}>
      <Grid container spacing={3} paddingLeft={10} paddingTop={5}>
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
                    // onChange={handleFilterChange}
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
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {proposalList?.length > 0
                ? proposalList.map((proposal, key) => {
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
                : null}
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
