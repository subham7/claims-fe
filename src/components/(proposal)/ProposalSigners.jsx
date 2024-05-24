import React from "react";
import { Typography } from "@mui/material";
import classes from "@components/(proposal)/Proposal.module.scss";

const ProposalSigners = () => {
  return (
    <div className={classes.signersContainer}>
      <div className={classes.heading}>
        <Typography variant="inherit" fontSize={16} fontWeight={600}>
          Treasury admins
        </Typography>

        <Typography variant="inherit" fontSize={14} color={"#707070"}>
          Signers <span style={{ color: "white", marginLeft: "4px" }}>3</span>
        </Typography>
      </div>
    </div>
  );
};

export default ProposalSigners;
