import React from "react";
import { Typography } from "@mui/material";

const UserInfo = ({ name, wallet, amount }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}>
      <div>
        <Typography variant="inherit" fontSize={18} fontWeight={700}>
          {name}
        </Typography>

        <Typography
          variant="inherit"
          fontSize={14}
          mt={0.5}
          fontWeight={700}
          color={"#707070"}>
          Owner : {wallet}
        </Typography>
      </div>

      <div>
        <Typography variant="inherit" color={"#707070"} mb={0.5} fontSize={12}>
          Total amount
        </Typography>
        <Typography variant="inherit" fontWeight={800} fontSize={18}>
          {amount}
        </Typography>
      </div>
    </div>
  );
};

export default UserInfo;
