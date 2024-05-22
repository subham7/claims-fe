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
            Activate LXP-L Rewards
          </Typography>
          <IoClose onClick={onClose} cursor={"pointer"} size={20} />
        </div>

        <Typography variant="inherit" fontSize={16} fontWeight={500} mb={4}>
          To activate LXP-L for your Station, you&apos;ll need to manually
          register your treasury (SAFE multisig on Linea Voyage: Surge)
        </Typography>

        <Typography variant="inherit" fontSize={16} fontWeight={500} mb={2}>
          <Typography variant="inherit" fontSize={20} fontWeight={550}>
            Step 1. Open your station&apos;s treasury (SAFE multisig)
          </Typography>
          <List>
            <ListItem style={{ listStyleType: "circle" }}>
              <p>
                Click{" "}
                <a
                  href="https://referrals.linea.build/?refCode=Z6CulbxWRz"
                  target="_blank"
                  rel="noopener noreferrer">
                  here
                </a>{" "}
                to start the registration process
              </p>
            </ListItem>
            <ListItem>
              <p>
                Open your{" "}
                <a
                  href={`https://safe.linea.build/home?safe=linea:${safeAddress}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  treasury
                </a>{" "}
                on a separate tab - address : <b>{safeAddress}</b>
              </p>
            </ListItem>
          </List>
        </Typography>

        <Typography variant="inherit" mb={2} mt={2}>
          <Typography variant="inherit" fontSize={20} fontWeight={550}>
            Step 2. Connect your SAFE multisig to Linea Surge
          </Typography>

          <List>
            <ListItem>
              Click on <b>&nbsp; connect wallet &nbsp;</b> on top right corner &
              click on <b>&nbsp;safe&nbsp;</b>
            </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_1.webp"}
          width={750}
          height={250}
          alt="Copy"
        />
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_2.webp"}
          width={500}
          height={500}
          alt="Copy"
        />
        <List>
          <ListItem>
            You will be prompted with a connection screen - find the{" "}
            <b>&nbsp; &apos;copy link&apos; &nbsp;</b> & go to the tab where
            your safe is open.{" "}
          </ListItem>
        </List>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_3.webp"}
          width={450}
          height={600}
          alt="Copy"
        />

        <Typography variant="inherit" mt={2}>
          <Typography variant="inherit" fontSize={20} fontWeight={550}>
            Step 3. Connect your SAFE multisig to Linea Surge (on SAFE dApp)
          </Typography>
          <List>
            <ListItem>
              On the SAFE UI, click on the{" "}
              <b>&nbsp; wallet connect icon &nbsp;</b> & paste the phrase that
              you just copied & <b>&nbsp; Approve &nbsp;</b>
            </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_4.webp"}
          width={900}
          height={60}
          alt="Copy"
        />
        <br />
        <div className="f-d">
          <Image
            style={{ display: "block", margin: "0 auto" }}
            src={"/assets/campaign/ActivateLXPModal/image_5.webp"}
            width={550}
            height={400}
            alt="Copy"
          />
          <Image
            style={{ display: "block", margin: "0 auto" }}
            src={"/assets/campaign/ActivateLXPModal/image_6.webp"}
            width={550}
            height={400}
            alt="Copy"
          />
        </div>

        <Typography variant="inherit" mt={2}>
          <Typography variant="inherit" fontSize={20} fontWeight={550}>
            Step 4. Initiate signature
          </Typography>
          <List>
            <ListItem>
              Go back to the Linea Surge tab & click on{" "}
              <b>&nbsp; Sign &nbsp;</b>{" "}
            </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_7.webp"}
          width={500}
          height={420}
          alt="Copy"
        />

        <Typography variant="inherit" mt={2}>
          <Typography variant="inherit" fontSize={20} fontWeight={550}>
            Step 5. Sign on SAFE
          </Typography>
          <List>
            <ListItem>
              <p>
                An off-chain sign request will be generated on the SAFE tab - go
                ahead & <b>&nbsp; sign &nbsp;</b> it (if you have multiple
                signers, make sure to sign instantaneously as the request might
                get timed out and you have to start the process from the start)
              </p>
            </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_8.webp"}
          width={700}
          height={700}
          alt="Copy"
        />

        <Typography variant="inherit" mt={2}>
          <Typography variant="inherit" fontSize={20} fontWeight={550}>
            Step 6. Activate and start earning LXP-L
          </Typography>
          <List>
            <ListItem>
              After signing, click on <b>&nbsp; Activate &nbsp;</b> &
              you&apos;re all set to start earning LXP-Ls{" "}
            </ListItem>
          </List>
        </Typography>
        <Image
          style={{ display: "block", margin: "0 auto" }}
          src={"/assets/campaign/ActivateLXPModal/image_9.webp"}
          width={800}
          height={400}
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
