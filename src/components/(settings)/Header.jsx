import React from "react";
import { Typography } from "@mui/material";
import classes from "@components/(settings)/Settings.module.scss";
import CustomSkeleton from "@components/skeleton/CustomSkeleton";
import { Box } from "@mui/material";

const Header = ({ clubName, clubSymbol, settingIsLoading }) => {
  return (
    <>
      {!settingIsLoading ? (
        <Box sx={{ width: "200px" }}>
          <CustomSkeleton width={"100%"} height={60} length={1} />
        </Box>
      ) : (
        <div className={classes.header}>
          <Typography variant="inherit" fontSize={24} fontWeight={700}>
            {clubName}
          </Typography>
          <Typography
            className={classes.subHeading}
            variant="inherit"
            fontSize={16}
            mt={0.5}>
            ${clubSymbol}
          </Typography>
        </div>
      )}
    </>
  );
};

export default Header;
