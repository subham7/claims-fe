import { Button, Typography } from "@components/ui";
import { CircularProgress, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { whitelistUser } from "api/invite/invite";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { AiFillInfoCircle } from "react-icons/ai";

const useStyles = makeStyles({
  card: {
    display: "flex",
    padding: "30px 40px",
    borderRadius: "20px",
    background: "#151515",
    alignItems: "flex-start",
    justifyContent: "space-around",
    gap: "20px",
    width: "80vw",
    margin: "0px auto",
  },
  contentDiv: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  inputDiv: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
  },
  imgDiv: {
    padding: "20px",
    borderRadius: "20px",
    width: "50vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    background:
      "transparent linear-gradient(45deg, #2E55FF 0%, #FF279C 100%) 0% 0% no-repeat padding-box",
  },
  img: {
    maxWidth: "60%",
    marginBottom: "20px",
  },
  link: {
    textDecoration: "underline",
    color: "#2D55FF",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
  },
  icon: {
    height: "16px",
    width: "16px",
  },
  inviteCode: {
    border: "1px solid white",
    borderRadius: "10px",
    padding: "12px",
    borderStyle: "dashed",
  },
  warningContainer: {
    color: "#ffb74d",
    background: "#ffb74d30",
    padding: "4px 8px",
    borderRadius: "8px",
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    marginTop: "12px",
    fontSize: "10px",
  },
});

const InviteCard = ({ setIsUserWhitelisted }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [newInviteCode, setNewInviteCode] = useState("");

  const onClick = async () => {
    try {
      setLoading(true);
      const response = await whitelistUser({
        address,
        referralCode: value.toUpperCase(),
      });
      if (response) {
        setShowInviteCode(true);
        setNewInviteCode(response.referralCode);
      }
    } catch (e) {
      console.error("Error whitelisting user", e);
      setIsUserWhitelisted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.card}>
      <div className={classes.imgDiv}>
        <img
          src="assets/icons/astronaut_laptop.png"
          className={classes.img}
          alt="whitelist img"
        />
        {!showInviteCode && (
          <div>
            <Typography variant="heading">
              25,189 people ahead of you.
            </Typography>
            <Typography variant="body">
              {`To gain insights from users into how we can make StationX better,
            we’re currently invite-only.`}
            </Typography>
          </div>
        )}
      </div>
      <div className={classes.contentDiv}>
        <div>
          <Typography variant="heading">
            {showInviteCode
              ? "You've been whitelisted!"
              : "Already got your invite?"}
          </Typography>
          <Typography variant="body">
            {showInviteCode
              ? "Share this code to whitelist a friend with a beta access to create stations on StationX"
              : `If you don't have an invite code, ask an existing user to invite you or
        sign up on the waitlist to get access`}
          </Typography>
        </div>
        <div className={classes.inputDiv}>
          <Typography>
            {showInviteCode ? "One-time invite code:" : "Enter 6-digit code"}
          </Typography>
          {showInviteCode ? (
            <div className={classes.inviteCode}>{newInviteCode}</div>
          ) : (
            <TextField
              fullWidth
              label="Invite code"
              variant="outlined"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          )}
          {showInviteCode ? (
            <div className={classes.warningContainer}>
              <AiFillInfoCircle size={20} />
              <Typography>
                This code will never be shown to you again
              </Typography>
            </div>
          ) : (
            <Typography
              onClick={() => window.open("https://tally.so/r/nG64GQ", "_blank")}
              className={classes.link}>
              {`I don't have an invite code`}{" "}
              <OpenInNewIcon className={classes.icon} />
            </Typography>
          )}
        </div>
        <div>
          {showInviteCode ? (
            <Button onClick={() => setIsUserWhitelisted(true)}>Done</Button>
          ) : (
            <Button onClick={onClick}>
              {loading ? <CircularProgress size={24} /> : "Submit"}{" "}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteCard;
