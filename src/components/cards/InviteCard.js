import { Button, Typography } from "@components/ui";
import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import React, { useState } from "react";

const useStyles = makeStyles({
  card: {
    display: "flex",
    padding: "30px 40px",
    borderRadius: "20px",
    background: "#151515",
    alignItems: "flex-start",
    justifyContent: "space-around",
    gap: "20px",
    width: "75vw",
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
    width: "50vh",
    height: "50vh",
  },
});

const InviteCard = () => {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const onClick = () => {};

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
          />
          <Typography>{`I don't have an invite code`}</Typography>
        </div>
        <div>
          <Button onClick={onClick}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default InviteCard;
