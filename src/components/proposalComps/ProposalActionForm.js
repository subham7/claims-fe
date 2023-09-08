import {
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNetwork } from "wagmi";
import { csvToObjectForMintGT } from "utils/helper";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { proposalActionCommands } from "utils/constants";
import { proposalFormData } from "utils/proposalData";

const useStyles = makeStyles({
  textField: {
    width: "100%",
    marginTop: "0.5rem",
    fontSize: "18px",
  },
});

const ProposalActionForm = ({ formik, tokenData, nftData }) => {
  const hiddenFileInput = useRef(null);
  const [file, setFile] = useState("");
  const [loadingCsv, setLoadingCsv] = useState(false);
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const classes = useStyles();

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = async (event, isMintGT = false) => {
    const fileUploaded = event.target.files[0];
    setLoadingCsv(true);
    setFile(fileUploaded);

    // new instance of fileReader class
    const reader = new FileReader();

    if (fileUploaded) {
      await reader.readAsText(fileUploaded);

      // converting .csv file into array of objects
      reader.onload = async (event) => {
        const csvData = event.target.result;
        if (!isMintGT) {
          const csvArr = csvData.split("\r\n");
          // setCSVObject(csvArr);
          formik.values.csvObject = csvArr;
          setLoadingCsv(false);
        } else {
          const { addresses, amounts } = csvToObjectForMintGT(csvData);
          formik.values.mintGTAmounts = amounts;
          formik.values.mintGTAddresses = addresses;
          setLoadingCsv(false);
        }
      };
    }
  };

  return (
    <Stack sx={{ marginTop: "1rem" }}>
      <Typography variant="proposalBody">
        Choose a command for this proposal to execute
      </Typography>
      <Select
        displayEmpty
        value={formik.actionCommand}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selectedKey = Object.keys(proposalActionCommands).find(
            (key) => proposalActionCommands[key] === selectedValue,
          );
          formik.setFieldValue("actionCommand", Number(selectedKey));
        }}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (!selected) {
            return "Select a command";
          }
          return selected;
        }}
        style={{
          borderRadius: "10px",
          background: "#0F0F0F 0% 0% no-repeat padding-box",
          width: "100%",
          marginTop: "0.5rem",
        }}
        error={
          formik.touched.actionCommand && Boolean(formik.errors.actionCommand)
        }
        helperText={
          formik.touched.actionCommand && formik.errors.actionCommand
        }>
        <MenuItem key={0} value="Distribute token to members">
          Distribute token to members
        </MenuItem>

        <MenuItem key={1} value="Mint club token">
          Mint club token
        </MenuItem>

        {isGovernanceActive ? (
          <MenuItem key={2} value="Update Governance Settings">
            Update Governance Settings
          </MenuItem>
        ) : null}
        {tokenType !== "erc721" ? (
          <MenuItem key={3} value="Change total raise amount">
            Change total raise amount
          </MenuItem>
        ) : null}

        <MenuItem key={4} value="Send token to an address">
          Send token to an address
        </MenuItem>
        <MenuItem key={5} value="Send nft to an address">
          Send nft to an address
        </MenuItem>
        <MenuItem key={6} value="Add signer">
          Add Signer
        </MenuItem>
        <MenuItem key={7} value="Remove signer">
          Remove Signer
        </MenuItem>
        <MenuItem key={8} value="Buy nft">
          Buy Nft
        </MenuItem>
        {/* <MenuItem key={9} value="Sell nft">
          Sell Nft
        </MenuItem> */}
        <MenuItem key={10} value="whitelist deposit">
          Whitelist Deposit
        </MenuItem>
        {/* <MenuItem key={11} value="whitelist with lens followers">
          Whitelist with Lens followers
        </MenuItem>
        <MenuItem key={12} value="whitelist with lens post's comments">
          Whitelist with Lens post&apos;s comments
        </MenuItem> */}
        <MenuItem key={13} value="update price per token">
          Update price per token
        </MenuItem>
        <MenuItem key={14} value="deposit tokens in AAVE pool">
          Deposit tokens in AAVE pool
        </MenuItem>
        <MenuItem key={15} value="withdraw tokens from AAVE pool">
          Withdraw tokens from AAVE pool
        </MenuItem>
      </Select>
      {proposalFormData({
        formik,
        tokenData,
        networkId,
        classes,
        handleChange,
        handleClick,
        hiddenFileInput,
        file,
        nftData,
      })}
    </Stack>
  );
};

export default ProposalActionForm;
