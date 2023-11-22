import { Button, Typography } from "@components/ui";
import { CircularProgress, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { whitelistUser } from "api/invite/invite";
import Image from "next/image";
import React, { useState } from "react";
import { useAccount } from "wagmi";

const useStyles = makeStyles({
  card: {
    display: "flex",
    padding: "30px 40px",
    borderRadius: "20px",
    background: "#151515",
    alignItems: "flex-start",
    justifyContent: "space-around",
    gap: "20px",
    width: "70vw",
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
  img: {
    objectFit: "contain",
    width: "60vh",
    height: "60vh",
  },
});

const InviteCard = ({ setIsUserWhitelisted }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      const response = await whitelistUser({
        address,
        referralCode: value.toUpperCase(),
      });
      if (response) {
        setIsUserWhitelisted(true);
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
      <div>
        <Image src="" className={classes.img} />
      </div>
      <div className={classes.contentDiv}>
        <div>
          <Typography variant="heading">Already got your invite?</Typography>
          <Typography variant="body">
            {`If you don't have an invite code, ask an existing user to invite you or
        sign up on the waitlist to get access`}
          </Typography>
        </div>
        <div className={classes.inputDiv}>
          <Typography>Enter 6-digit code</Typography>
          <TextField
            fullWidth
            label="Invite code"
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
          <Typography>{`I don't have an invite code`}</Typography>
        </div>
        <div>
          <Button onClick={onClick}>
            {loading ? <CircularProgress size={24} /> : "Submit"}{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteCard;
