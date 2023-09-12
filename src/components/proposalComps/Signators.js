import { Card, Divider, Grid, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React from "react";
import { makeStyles } from "@mui/styles";
import { shortAddress } from "utils/helper";

const useStyles = makeStyles({
  listFont2: {
    fontSize: "18px",
    color: "#dcdcdc",
  },
});

const Signators = ({ ownerAddresses, signedOwners, isSurvey = false }) => {
  const classes = useStyles();
  return (
    <Grid item md={3} minWidth={isSurvey && "340px"}>
      <Card
        sx={{
          minHeight: "140px",
        }}>
        <Grid container>
          <Typography className={classes.listFont2}>Signators</Typography>
          <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
        </Grid>
        <Grid>
          {ownerAddresses?.map((owner) => (
            <Grid
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
              key={owner}>
              {signedOwners?.includes(owner) ? (
                <DoneIcon
                  fill="blue"
                  sx={{ marginRight: 2, color: "#2D55FF" }}
                />
              ) : (
                <HelpOutlineIcon sx={{ marginRight: 2 }} />
              )}
              <Typography>{shortAddress(owner)}</Typography>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
};

export default Signators;
