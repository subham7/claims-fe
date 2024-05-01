import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import Image from "next/image";
import { Typography } from "@mui/material";
import { IoClose } from "react-icons/io5";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const LineaCreateModal = ({ onClose }) => {
  useLockBodyScroll(true);
  return (
    <Modal className={classes.modal}>
      <div className={classes.lineaModal}>
        <Image
          src={"/assets/images/lineaBanner.png"}
          height={380}
          width={380}
        />
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Typography variant="inherit" mb={2} fontSize={20} fontWeight={800}>
              Earn Rewards on Linea 🎉
            </Typography>
            <IoClose
              onClick={onClose}
              cursor={"pointer"}
              color="#707070"
              size={20}
            />
          </div>

          <Typography
            variant="inherit"
            mb={1.4}
            fontSize={16}
            color={"#707070"}>
            Congratulations! This station is eligible for rewards. To celebrate
            our launch on Linea, we&apos;re enabling users to participate in
            “The Surge” and earn rewards directly into their stations.
          </Typography>

          <Typography
            variant="inherit"
            fontSize={16}
            color={"#707070"}
            mb={0.2}>
            1. Deposit at least 100 USDC or 0.01 ETH into your station from the
            contribution link.
          </Typography>
          <Typography
            variant="inherit"
            fontSize={16}
            color={"#707070"}
            mb={0.2}>
            2. Start earning LXP-Ls by holding funds inside the station.
          </Typography>
          <Typography
            variant="inherit"
            fontSize={16}
            color={"#707070"}
            mb={0.2}>
            3. Go to featured pools and stake funds into integrated DeFi
            protocols to earn multiplier on your hourly rewards.
          </Typography>

          <Typography
            variant="inherit"
            mt={1.4}
            fontSize={16}
            color={"#707070"}>
            ⚡️ The bigger the share of TVL and activity inside the station,
            higher the rewards.
          </Typography>
        </div>
      </div>
    </Modal>
  );
};

export default LineaCreateModal;
