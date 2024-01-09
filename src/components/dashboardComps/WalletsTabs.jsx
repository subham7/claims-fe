import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { shortAddress } from "utils/helper";

const WalletsTabs = ({
  classes,
  currentEOAWallet,
  currentEOAWalletChangeHandler,
  gnosisAddress,
  networkId,
  allEOAWallets,
}) => {
  return (
    <div className={classes.assetsType}>
      <FormControl sx={{ minWidth: 150 }}>
        <Select
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            fontFamily: "inherit",
            backgroundColor: "inherit",
          }}
          value={currentEOAWallet}
          onChange={currentEOAWalletChangeHandler}
          renderValue={(selected) =>
            selected.walletName
              ? selected.walletName
              : shortAddress(selected.walletAddress)
          }
          displayEmpty>
          <MenuItem
            sx={{
              fontFamily: "inherit",
            }}
            value={{
              walletAddress: gnosisAddress,
              walletName: "Treasury",
              networkId,
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "4px",
              }}>
              <Image
                src={`/assets/networks/${networkId}.png`}
                height={20}
                width={20}
                alt={networkId}
                style={{
                  borderRadius: "50%",
                }}
              />
              <Typography variant="inherit" fontSize={14}>
                Treasury
              </Typography>
            </div>
          </MenuItem>
          {allEOAWallets.map((wallet) => (
            <MenuItem
              key={`${wallet.walletAddress}${wallet.networkId}`}
              sx={{
                fontFamily: "inherit",
              }}
              value={wallet}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "4px",
                }}>
                <Image
                  src={`/assets/networks/${wallet.networkId}.png`}
                  height={20}
                  width={20}
                  alt={wallet.networkId}
                  style={{
                    borderRadius: "50%",
                  }}
                />
                <Typography variant="inherit" fontSize={14}>
                  {wallet.walletName
                    ? wallet.walletName
                    : shortAddress(wallet.walletAddress)}
                </Typography>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default WalletsTabs;
