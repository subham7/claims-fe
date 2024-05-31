import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import classes from "@components/(proposal)/Proposal.module.scss";
import { useSelector } from "react-redux";
import { getSafeSdk, shortAddress } from "utils/helper";
import { useAccount } from "wagmi";
import Web3 from "web3";
import Image from "next/image";
import { FaRegCopy } from "react-icons/fa";

const ProposalSigners = ({ daoAddress, routeNetworkId }) => {
  const [ownerAddresses, setOwnerAddresses] = useState([]);
  const { address: walletAddress } = useAccount();

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const fetchOwners = async () => {
    try {
      const { safeSdk } = await getSafeSdk(
        gnosisAddress,
        walletAddress,
        "",
        routeNetworkId,
      );

      const owners = await safeSdk.getOwners();

      const ownerAddressesArray = owners?.map((value) =>
        Web3.utils.toChecksumAddress(value),
      );

      setOwnerAddresses(ownerAddressesArray);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (daoAddress && routeNetworkId && gnosisAddress && walletAddress) {
      fetchOwners();
    }
  }, [routeNetworkId, daoAddress, walletAddress, gnosisAddress]);

  return (
    <div className={classes.signersContainer}>
      <div className={classes.heading}>
        <Typography variant="inherit" fontSize={16} fontWeight={600}>
          Treasury admins
        </Typography>

        <Typography variant="inherit" fontSize={14} color={"#707070"}>
          Signers{" "}
          <span style={{ color: "white", marginLeft: "4px" }}>
            {ownerAddresses.length}
          </span>
        </Typography>
      </div>

      <div className={classes.signersList}>
        {ownerAddresses.map((owner) => (
          <div className={classes.signer} key={owner}>
            <Image
              src="/assets/icons/signer.png"
              height={30}
              width={30}
              alt={owner}
            />

            <div>
              <Image
                src="/assets/icons/avatar2.png"
                height={15}
                width={15}
                alt={"icon"}
              />

              <Typography variant="inherit" fontSize={14}>
                {shortAddress(owner)}
              </Typography>
            </div>
            <FaRegCopy size={32} className={classes.copyAddress} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalSigners;
