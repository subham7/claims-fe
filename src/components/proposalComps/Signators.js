import { Card, Divider, Grid, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  listFont2: {
    fontSize: "19px",
    color: "#C1D3FF",
  },
});

const Signators = ({ ownerAddresses, signedOwners }) => {
  const classes = useStyles();
  return (
    <Grid item md={3}>
      <Card>
        <Grid container >
          <Typography className={classes.listFont2}>Signators</Typography>
          <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
        </Grid>
        <Grid sx={{ overflow: "scroll" }}>
          {ownerAddresses?.map((owner) => (
            <Grid
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
              key={owner}
            >
              {signedOwners?.includes(owner) ? (
                <DoneIcon
                  fill="blue"
                  sx={{ marginRight: 2, color: "#3B7AFD" }}
                />
              ) : (
                <HelpOutlineIcon sx={{ marginRight: 2 }} />
              )}
              <Typography>
                {owner.slice(0, 6)}.....{owner.slice(-4)}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
};

export default Signators;
