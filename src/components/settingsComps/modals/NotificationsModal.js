import React from "react";
import { Typography, Dialog, DialogContent } from "@mui/material";
import { Button } from "@components/ui";
import { makeStyles } from "@mui/styles";
import Link from "next/link";

const useStyles = makeStyles({
  container: { width: "660px" },
  modal: {
    backgroundColor: "#151515",
  },
  heading: {
    fontSize: "28px !important",
    marginBottom: "20px  !important",
    fontFamily: "inherit  !important",
    fontWeight: "500  !important",
  },
  textGray: {
    fontSize: "16px !important",
    color: "#707070",
    padding: "10px 0px",
  },
  textWhite: {
    fontSize: "16px !important",
  },
  link: {
    textDecoration: "underline",
    color: "#2E55FF",
  },
  button: { width: "100%" },
  codeblock: {
    margin: "12px 0px",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#000",
  },
  redCode: {
    color: "#f22c3d",
  },
  blueCode: {
    color: "#2e95d3",
  },
  greenCode: {
    color: "#00a67d",
    fontStyle: "italic",
  },
});
const NotificationsModal = ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogContent
        sx={{
          overflow: "hidden",
          backgroundColor: "#202020",
          padding: "1.5rem",
        }}>
        <div>
          <Typography className={classes.heading}>Add notifications</Typography>
          <Typography className={classes.textGray}>
            Add a #TELEGRAM notification BOT to your group chat{" "}
          </Typography>
          <Typography className={classes.textWhite}>
            Step 1: Add this bot to your group USERNAME: @stnx_v1_bot
          </Typography>
          <Typography className={classes.textWhite}>
            Step 2: Type the subscribe command to start receiving notifications
            from your station
          </Typography>
          <Typography className={classes.textGray}>
            Add a #DISCORD notification BOT to your channel{" "}
          </Typography>
          <Typography className={classes.textWhite}>
            Step 1: Add the discord bot to your channel by going to this{" "}
            <Link
              className={classes.link}
              rel="noopener noreferrer"
              target="_blank"
              href={
                "https://discord.com/oauth2/authorize?client_id=1146021094785032255&permissions=2048&scope=bot"
              }>
              link
            </Link>{" "}
          </Typography>
          <Typography className={classes.textWhite}>
            Step 2: Type the subscribe command to start receiving notifications
            from your station{" "}
          </Typography>
          <div className={classes.codeblock}>
            <Typography>
              $ <span className={classes.redCode}>SUBSCRIBE COMMAND: </span>{" "}
              <span className={classes.blueCode}>/subscribe</span>
              <span className={classes.greenCode}>
                {" "}
                &lt;Insert station’s contract address&gt;{" "}
              </span>
            </Typography>
            <Typography>
              $ <span className={classes.redCode}>UNSUBSCRIBE COMMAND: </span>
              <span className={classes.blueCode}>/unsubscribe</span>
              <span className={classes.greenCode}>
                {" "}
                &lt;Insert station’s contract address&gt;{" "}
              </span>
            </Typography>
          </div>
          <Button onClick={onClose} className={classes.button}>
            FINISH
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
