import React, { useState } from "react";
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

const Proposal = () => {
  const [selectedListItem, setSelectedListItem] = useState(
    proposalDisplayOptions[0].type,
  );
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          </Grid>
        </Grid>
        <Grid item md={4}>
          <DocsCard />
        </Grid>
      </Grid>
      <CreateProposalDialog open={open} onClose={handleClose} />
    </Layout1>
  );
};

export default Proposal;
