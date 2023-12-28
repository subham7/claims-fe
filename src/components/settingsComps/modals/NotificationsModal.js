import React from "react";
import { Typography, Dialog, DialogContent, IconButton } from "@mui/material";
import { Button } from "@components/ui";
import Link from "next/link";
import Close from "@mui/icons-material/Close";
import styles from "./NotificationModal.module.scss";

const NotificationsModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogContent className={styles.dialogContent}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={styles.iconButton}>
          <Close />
        </IconButton>
        <div>
          <Typography className={styles.heading}>Add notifications</Typography>
          <Typography className={styles.textGray}>
            Add a #TELEGRAM notification BOT to your group chat
          </Typography>
          <Typography className={styles.textWhite}>
            Step 1: Add this bot to your group USERNAME: @stnx_v1_bot
          </Typography>
          <Typography className={styles.textWhite}>
            Step 2: Type the subscribe command to start receiving notifications
            from your station
          </Typography>
          <Typography className={styles.textGray}>
            Add a #DISCORD notification BOT to your channel
          </Typography>
          <Typography className={styles.textWhite}>
            Step 1: Add the discord bot to your channel by going to this{" "}
            <Link
              className={styles.link}
              rel="noopener noreferrer"
              target="_blank"
              href={
                "https://discord.com/oauth2/authorize?client_id=1146021094785032255&permissions=2048&scope=bot"
              }>
              link
            </Link>
          </Typography>
          <Typography className={styles.textWhite}>
            Step 2: Type the subscribe command to start receiving notifications
            from your station
          </Typography>
          <div className={styles.codeblock}>
            <Typography>
              $ <span className={styles.redCode}>SUBSCRIBE COMMAND: </span>{" "}
              <span className={styles.blueCode}>/subscribe</span>
              <span className={styles.greenCode}>
                {" "}
                &lt;Insert station’s contract address&gt;
              </span>
            </Typography>
          </div>
          <div className={styles.codeblock}>
            <Typography>
              $ <span className={styles.redCode}>UNSUBSCRIBE COMMAND: </span>{" "}
              <span className={styles.blueCode}>/unsubscribe</span>
              <span className={styles.greenCode}>
                {" "}
                &lt;Insert station’s contract address&gt;
              </span>
            </Typography>
          </div>
          <Button onClick={onClose} className={styles.button}>
            FINISH
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
