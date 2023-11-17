import { Stack } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNetwork } from "wagmi";
import { csvToObjectForMintGT } from "utils/helper";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CHAIN_CONFIG } from "utils/constants";
import { proposalFormData } from "utils/proposalData";
import Web3 from "web3";

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

  let filteredTokens = [];
  tokenData?.map((token) => {
    if (
      token.address === CHAIN_CONFIG[networkId].nativeToken ||
      Web3.utils.toChecksumAddress(token.address) ===
        CHAIN_CONFIG[networkId].usdcAddress
    ) {
      filteredTokens.push(token);
    }
  });

  let stargateFilteredTokens = [];
  tokenData?.map((token) => {
    if (
      CHAIN_CONFIG[networkId].stargateStakingAddresses.includes(token.address)
    ) {
      stargateFilteredTokens.push(token);
    }
  });

  let stargateUnstakeFilteredTokens = [];
  tokenData?.map((token) => {
    if (
      CHAIN_CONFIG[networkId].stargateUnstakingAddresses.includes(token.address)
    ) {
      stargateUnstakeFilteredTokens.push(token);
    }
  });

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
    <Stack>
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
        filteredTokens:
          formik.values.actionCommand === 17
            ? stargateFilteredTokens
            : formik.values.actionCommand === 18
            ? stargateUnstakeFilteredTokens
            : filteredTokens,
      })}
    </Stack>
  );
};

export default ProposalActionForm;
