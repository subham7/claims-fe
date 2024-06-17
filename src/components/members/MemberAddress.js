import { TableCell, Tooltip, Typography } from "@mui/material";
import React from "react";
import { shortAddress } from "utils/helper";
import { useEnsName } from "wagmi";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const MemberAddress = ({ userAddress, handleAddressClick, memberProfiles }) => {
  const { data: ensName } = useEnsName({
    address: userAddress,
    chainId: 1,
  });
  return (
    <TableCell
      sx={{
        fontFamily: "inherit",
        fontSize: "16px",
        background: "#111111",
      }}
      align="left">
      <Typography variant="inherit">
        <Tooltip title={userAddress}>
          <div
            className="f-d f-v-c f-gap-8 c-pointer"
            onClick={(e) => {
              handleAddressClick(e, userAddress);
            }}>
            {memberProfiles?.has(userAddress) &&
            memberProfiles?.get(userAddress) !== undefined
              ? memberProfiles?.get(userAddress)
              : ensName
              ? ensName
              : shortAddress(userAddress)}
            <OpenInNewIcon
              sx={{
                fontSize: "14px",
              }}
            />
          </div>
        </Tooltip>
      </Typography>
    </TableCell>
  );
};

export default MemberAddress;
