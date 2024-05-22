import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import Image from "next/image";
import { Button, Typography } from "@mui/material";
import { IoClose } from "react-icons/io5";
import useLockBodyScroll from "hooks/useLockBodyScroll";
import { AiFillInfoCircle } from "react-icons/ai";

const LineaCreateModal = ({ onClose, onClick }) => {
  useLockBodyScroll(true);
  return (
    <Modal className={classes.modal}>
      <div>
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
              <Typography
                variant="inherit"
                mb={2}
                fontSize={20}
                fontWeight={800}>
                Earn Rewards on Linea 🎉
              </Typography>
              <IoClose
                onClick={onClose}
                cursor={"pointer"}
                color="#fffff"
                size={20}
              />
            </div>

            <Typography
              variant="inherit"
              mb={1.4}
              fontSize={16}
              color={"whitesmoke"}>
              Create your DeFi squad & start earning LXPs.
            </Typography>

            <Typography
              variant="inherit"
              fontSize={16}
              color={"whitesmoke"}
              mb={1}>
              1. Add atleast $100 into your Station via your contribution link
              to start earning LXPs.
            </Typography>
            <Typography
              variant="inherit"
              fontSize={16}
              color={"whitesmoke"}
              mb={1}>
              2. You can also share your Station’s contribution link with your
              frens & community and turn it into a Defi Squad. More members &
              treasury size earns you higher LXPs.
            </Typography>
            <Typography
              variant="inherit"
              fontSize={16}
              color={"whitesmoke"}
              mb={1}>
              3. Stake your Station’s treasury across multiple DeFi protocols to
              start earning yield on your treasury along with points from top
              Linea protocols.
            </Typography>

            <Typography
              variant="inherit"
              mt={2}
              fontSize={16}
              color={"whitesmoke"}>
              ⚡️ The bigger the share of TVL and activity inside the station,
              higher the rewards.
            </Typography>
          </div>
        </div>
        <div className={classes.infoContainer}>
          <AiFillInfoCircle size={20} />
          <Typography fontSize={18}>Activate LXP-L Rewards </Typography>
          <Button
            style={{
              marginLeft: "5px",
              backgroundColor: "white",
              color: "black",
              textTransform: "none",
            }}
            variant="contained"
            onClick={onClick}>
            Learn more
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LineaCreateModal;
