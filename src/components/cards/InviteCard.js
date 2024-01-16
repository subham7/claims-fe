import { Button, Typography } from "@components/ui";
import { CircularProgress, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { whitelistUser } from "api/invite/invite";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { AiFillInfoCircle } from "react-icons/ai";
import Image from "next/image";
import { BsTwitter } from "react-icons/bs";

const useStyles = makeStyles({
  card: {
    display: "flex",
    padding: "32px",
    borderRadius: "12px",
    background: "#151515",
    alignItems: "flex-start",
    justifyContent: "space-around",
    gap: "32px",
    width: "70vw",
    margin: "0px auto",
    marginTop: "20px",
  },
  contentDiv: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    marginTop: "20px",
  },
  inputDiv: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
  },
  imgDiv: {
    padding: "20px",
    borderRadius: "12px",
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
    marginBottom: "40px",
    marginTop: "20px",
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
    fontSize: "14px",
  },
  share: {
    padding: "8px",
    borderRadius: "12px",
    background: "black",
    display: "flex",
    alignItems: "center",
    maxWidth: "200px",
    marginBottom: "12px",
    gap: "8px",
  },
  lensImg: {
    borderRadius: "4px",
    background: "#8B5BF9",
  },
  textHeading: {
    marginBottom: "8px",
  },
  subText: {
    fontSize: "16px",
    lineHeight: "20px",
  },
});

const InviteCard = ({ setIsUserWhitelisted }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [newInviteCode, setNewInviteCode] = useState("NO CODE");

  const onClick = async () => {
    try {
      setLoading(true);
      const response = await whitelistUser({
        address,
        referralCode: value.toUpperCase(),
      });
      if (response) {
        setShowInviteCode(true);
        setNewInviteCode(response);
      }
    } catch (e) {
      console.error("Error whitelisting user", e);
      setIsUserWhitelisted && setIsUserWhitelisted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.card}>
      <div className={classes.imgDiv}>
        <img
          src={
            showInviteCode
              ? "assets/icons/astronaut_station.png"
              : "assets/icons/astronaut_laptop.png"
          }
          className={classes.img}
          alt="whitelist img"
        />
        {!showInviteCode && (
          <div>
            <Typography className={classes.textHeading} variant="subheading">
              <b>25k+ people ahead of you</b>
            </Typography>
            <Typography className={classes.subText} variant="body">
              {`To gain insights from users into how we can make StationX better,
            we’re currently invite-only`}
            </Typography>
          </div>
        )}
      </div>
      <div className={classes.contentDiv}>
        <div>
          <Typography className={classes.textHeading} variant="subheading">
            <b>
              {showInviteCode ? "You've been whitelisted!" : "Got your invite?"}
            </b>
          </Typography>
          <Typography className={classes.subText} variant="body">
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
            <div>
              <div className={classes.warningContainer}>
                <AiFillInfoCircle size={20} />
                This code will never be shown to you again
              </div>
              <div className={classes.share}>
                <BsTwitter size={18} />
                <a
                  href={`https://twitter.com/intent/tweet?text=It's here!🛸%0AUse my invite code ${newInviteCode} to get access to @stationxnetwork`}
                  target="_blank"
                  rel="noreferrer">
                  Tweet on X
                </a>
              </div>
              <div className={classes.share}>
                <Image
                  className={classes.lensImg}
                  src="/assets/icons/lenster-comp.jpeg"
                  alt="Share on Lenster"
                  height={20}
                  width={20}
                />
                <a
                  href={`https://lenster.xyz/?text=It's here!🛸%0AUse my invite code ${newInviteCode} to get access to @stationxnetwork`}
                  target="_blank"
                  rel="noreferrer">
                  Post on Lenster
                </a>
              </div>
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
            <Button
              onClick={() => setIsUserWhitelisted(true)}
              variant="contained">
              Done
            </Button>
          ) : (
            <Button onClick={onClick} variant="contained">
              {loading ? <CircularProgress size={24} /> : "Submit"}{" "}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteCard;
