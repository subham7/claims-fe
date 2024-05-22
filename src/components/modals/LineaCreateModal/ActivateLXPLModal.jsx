import React from "react";
import classes from "./LineaCreateModal.module.scss";
import Modal from "@components/common/Modal/Modal";
import { List, ListItem, Typography } from "@mui/material";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const ActivateLXPLModal = ({ onClose, safeAddress }) => {
  useLockBodyScroll(true);
  return (
    <Modal onClose={onClose} className={classes.modal}>
      <div className={classes.activateLXPModal}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Typography variant="inherit" fontSize={26} fontWeight={900} mb={1}>
            Activate LXP-L
          </Typography>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <Typography variant="inherit" fontSize={16} fontWeight={500} mb={4}>
          To activate LXP-L for your Station, you&apos;ll need to manually
          register your treasury (SAFE multisig on Linea Voyage: Surge)
        </Typography>

        <Typography variant="inherit" fontSize={16} fontWeight={500} mb={2}>
          Step 1.
          <List>
            <ListItem style={{ listStyleType: "circle" }}>
              <p>
                Click here{" "}
                <a
                  href="https://referrals.linea.build/?refCode=Z6CulbxWRz"
                  target="_blank"
                  rel="noopener noreferrer">
                  (https://referrals.linea.build/?refCode=Z6CulbxWRz)
                </a>{" "}
                to start the registration process - Open your treasury (Dynamic
                link to this station’s safe) on a separate tab - your treasury
                link{" "}
                <a
                  href={`https://safe.linea.build/home?safe=linea:${safeAddress}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  (https://safe.linea.build/home?safe=linea:${safeAddress})
                </a>
              </p>
            </ListItem>
            <ListItem>
              Open your treasury (Dynamic link to this station’s safe) on a
              separate tab - your treasury link (safe.linea.build link)
            </ListItem>
          </List>
        </Typography>

        <Typography variant="inherit" mb={2} mt={2}>
          Step 2.
          <List>
            <ListItem>
              Click on connect wallet on top right corner & click on safe
            </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_1.png"}
          width={900}
          height={300}
          alt="Copy"
        />
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_2.png"}
          width={900}
          height={900}
          alt="Copy"
        />
        <List>
          <ListItem>
            You will be prompted with a connection screen - find the &apos;copy
            link&apos; & go to the tab where your safe is open.{" "}
          </ListItem>
        </List>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_3.png"}
          width={900}
          height={1200}
          alt="Copy"
        />

        <Typography variant="inherit" mt={2}>
          Step 3.
          <List>
            <ListItem>
              On the SAFE UI, click on the wallet connect icon & paste the
              phrase that you just copied & Approve
            </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_4.png"}
          width={900}
          height={60}
          alt="Copy"
        />
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_5.png"}
          width={900}
          height={550}
          alt="Copy"
        />
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_6.png"}
          width={900}
          height={700}
          alt="Copy"
        />

        <Typography variant="inherit" mt={2}>
          Step 4.
          <List>
            <ListItem>Go back to the Linea Surge tab & click on sign </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_7.png"}
          width={900}
          height={800}
          alt="Copy"
        />

        <Typography variant="inherit" mt={2}>
          Step 5.
          <List>
            <ListItem>
              An off-chain sign request will be generated on the SAFE tab - go
              ahead & sign it (if you have multiple signers, make sure to sign
              instantaneously as the request might get timed out and you have to
              start the process from the start)
            </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_8.png"}
          width={900}
          height={900}
          alt="Copy"
        />

        <Typography variant="inherit" mt={2}>
          Step 6.
          <List>
            <ListItem>
              After signing, click on Activate & you&apos;re all set to start
              earning LXP-Ls{" "}
            </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_9.png"}
          width={900}
          height={450}
          alt="Copy"
        />
        <Typography variant="inherit" mt={2}>
          You can check your points on{" "}
          <a
            href=" https://www.openblocklabs.com/app/linea/dashboard"
            target="_blank"
            rel="noopener noreferrer">
            https://www.openblocklabs.com/app/linea/dashboard
          </a>{" "}
          by copy-pasting your treasury address that you’ll find inside your
          settings page.
        </Typography>
      </div>
    </Modal>
  );
};

export default ActivateLXPLModal;
