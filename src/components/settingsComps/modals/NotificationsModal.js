import React from "react";
import { Typography, Dialog, DialogContent, IconButton } from "@mui/material";
import { Button } from "@components/ui";
import Link from "next/link";
import Close from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styles from "./NotificationModal.module.scss";

const NotificationsModal = ({ open, onClose, daoAddress }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
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
            Add a TELEGRAM notification BOT to your group chat
          </Typography>
          <Typography className={styles.textWhite}>
            Step 1: Add the telegram bot to your group by going to this{" "}
            <Link
              className={styles.link}
              rel="noopener noreferrer"
              target="_blank"
              href={"https://t.me/StationX_Notifications_Bot"}>
              link
            </Link>
          </Typography>
          <Typography className={styles.textWhite}>
            Step 2: Type the subscribe command to start receiving notifications
            from your station
          </Typography>
          <Typography className={styles.textGray}>
            Add a DISCORD notification BOT to your channel
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
              <span className={styles.blueCode}>/subscribe </span>{" "}
              <span className={styles.greenCode}>{daoAddress}</span>
            </Typography>
            <IconButton
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(`/subscribe ${daoAddress}`);
              }}>
              <ContentCopyIcon className={styles.iconColor} />
            </IconButton>
          </div>
          <div className={styles.codeblock}>
            <Typography>
              <span className={styles.blueCode}>/unsubscribe</span>{" "}
              <span className={styles.greenCode}>{daoAddress}</span>
            </Typography>
            <IconButton
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(`/unsubscribe ${daoAddress}`);
              }}>
              <ContentCopyIcon className={styles.iconColor} />
            </IconButton>
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
