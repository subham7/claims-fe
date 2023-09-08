import {
  Backdrop,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

const SafeDepositLoadingModal = ({ open, title, description }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundImage: "url(assets/images/gradients.png)",
        backgroundPosition: "center center",
      }}
      open={open}>
      <Card>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ padding: "10px", width: "547px" }}
          direction="column">
          <Grid item>
            <img src="assets/images/deployingsafe_img.svg" />
          </Grid>
          <Grid
            item
            paddingTop="20px"
            justifyContent="left"
            justifyItems="left">
            <Typography variant="h4" sx={{ color: "#fff" }}>
              {title}
            </Typography>
          </Grid>
          <Grid
            item
            paddingTop="20px"
            justifyContent="left"
            justifyItems="left">
            <Typography variant="regularText4" sx={{ color: "#fff" }}>
              {description}
            </Typography>
          </Grid>
          <Grid item paddingTop="30px">
            <CircularProgress />
          </Grid>
        </Grid>
      </Card>
    </Backdrop>
  );
};

export default SafeDepositLoadingModal;
