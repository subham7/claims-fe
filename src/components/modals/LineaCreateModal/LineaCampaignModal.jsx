import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { Typography } from "@mui/material";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const LineaCampaignModal = ({ onClose }) => {
  useLockBodyScroll(true);
  return (
    <Modal className={classes.modal}>
      <div className={classes.campaignModal}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          {/* <Typography variant="inherit" fontSize={20} fontWeight={900} mb={1}>
            Welcome astronauts to StationX!
          </Typography> */}
          <Typography variant="inherit" fontSize={20} fontWeight={900} mb={1}>
            Linea Surge 🤝 StationX
          </Typography>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>
        {/* <Typography variant="inherit" fontSize={16} fontWeight={500} mb={4}>
          StationX is a capital coordination protocol - pool funds, manage
          members & deploy capital.
        </Typography> */}

        {/* <Typography variant="inherit" fontSize={20} fontWeight={900} mb={1}>
          Linea Surge 🤝 StationX
        </Typography> */}
        <Typography variant="inherit" fontSize={16} fontWeight={500} mb={4}>
          Pool capital with your frens & community, deploy it across trusted
          DeFi protocols & start earning yield & rewards!
        </Typography>

        <Typography variant="inherit" fontSize={16} fontWeight={500} mb={2}>
          Invite people into your station by sharing the contribution link.
        </Typography>
        <Image
          src={"/assets/campaign/copyLinea.png"}
          width={600}
          height={320}
          alt="Copy"
        />

        <Typography variant="inherit" mb={2} mt={2}>
          See your treasury, members & ownership information on the dashboard
        </Typography>
        <Image
          src={"/assets/campaign/dashboard.png"}
          width={600}
          height={250}
          alt="Copy"
        />

        <Typography variant="inherit" mt={2}>
          Stake on DeFi protocols directly via your Station dashboard. Create
          your own DeFi strategy to maximise returns & rewards across 7+
          protocols.
        </Typography>
      </div>
    </Modal>
  );
};

export default LineaCampaignModal;
