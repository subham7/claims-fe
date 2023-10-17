import { Button, Grid, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { TwitterShareButton } from "react-twitter-embed";
import { IoMdClose } from "react-icons/io";
import LensterShareButton from "../LensterShareButton";
import BackdropLoader from "@components/common/BackdropLoader";

const useStyles = makeStyles({
  modal: {
    width: "570px",
    background: "#0F0F0F",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 2002,
    padding: "28px 25px",
    borderRadius: "20px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
  },
  title: {
    letterSpacing: "0.4px",

    fontSize: "28px",
  },
  subtitle: {
    color: "#dcdcdc",
    fontSize: "16px",
    marginBottom: "6px",
  },
  btn: {
    background: "#2D55FF",
    borderRadius: "10px",
    padding: "13px 30px",
    marginTop: "20px",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: 500,
    letterSpacing: "0.6px",
    fontSize: "16px",
  },
  relative: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: "-23px",
    right: 0,
    cursor: "pointer",
  },
  inviteLink: {
    background:
      "transparent linear-gradient(90deg, #0F0F0F00 0%, #2D55FF 100%) 0% 0% no-repeat padding-box",
    position: "",
    display: "block",
    padding: "0px 20px",
    overflowX: "scroll",
    marginTop: "20px",
    borderRadius: "10px",
    border: "1px solid gray",
    color: "#a7a6ba",
    paddingRight: "20px",
  },
  copy: {
    width: "68px",
    height: "30px",
    background: "#2D55FF 0% 0% no-repeat padding-box",
    borderRadius: "15px",
  },
  linkInput: {
    width: "100%",
    color: "#dcdcdc",
    background: "#0F0F0F 0% 0% no-repeat padding-box",
    border: "1px solid #dcdcdc40",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #dcdcdc40",
      border: "1px solid #dcdcdc40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
});

const LegalEntityModal = ({
  onClose,
  isCreating = false,
  isSuccess = false,
  isInvite = false,
  encryptedLink,
  isTwitter = false,
  daoAddress,
  networkId,
}) => {
  const [isCopy, setIsCopy] = useState(false);
  const classes = useStyles();
  const router = useRouter();

  // create legal Entity
  const createLegalEntityHandler = () => {
    router.push("/legalEntity");
  };

  // back to dashboard
  const dashboardHandler = () => {
    // add dynamic link
    router.push(`/dashboard/${daoAddress}/${networkId}`);
  };

  // copy link
  const copyHandler = () => {
    navigator.clipboard.writeText(
      typeof window !== "undefined" && window.location.origin
        ? `${window.location.origin}/documents/${daoAddress}/${networkId}/sign/${encryptedLink}`
        : null,
    );
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 3000);
  };

  return (
    <>
      <BackdropLoader showLoading={false} isOpen={true}>
        <div className={classes.modal}>
          <div className={classes.relative}>
            <h2 className={classes.title}>
              {isCreating && "Create a legal entity"}{" "}
              {isInvite && "Invite members to sign"} {isSuccess && "Success"}
            </h2>
            <p className={classes.subtitle}>
              {isCreating &&
                "Create a legal entity for this Station & invite members to sign the document by sharing a private link. (Sharing publicly may violate security laws)"}{" "}
              {isInvite &&
                "Share this link privately with members who should sign the legal document of the Station (Sharing publicly may violate security laws)"}{" "}
              {isSuccess &&
                "You’ve successfully signed the legal doc inside your Station & have been added as a member in the agreement."}
              {isTwitter &&
                "You’ve successfully created a station. Let other people know and join your station through twitter"}
            </p>
            {isInvite && (
              <Grid container>
                <Grid item md={12} mt={2} ml={1} mr={1}>
                  <TextField
                    className={classes.linkInput}
                    disabled
                    value={
                      typeof window !== "undefined" && window.location.origin
                        ? `${window.location.origin}/documents/${daoAddress}/${networkId}/sign/${encryptedLink}`
                        : null
                    }
                    InputProps={{
                      endAdornment: (
                        <Button
                          variant="contained"
                          className={classes.copy}
                          onClick={copyHandler}>
                          {isCopy ? "Copied" : "Copy"}
                        </Button>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
            {isTwitter && (
              <Grid
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                mt={5}>
                <div>
                  <div>
                    <TwitterShareButton
                      onLoad={function noRefCheck() {}}
                      options={{
                        size: "large",
                        text: `Just created a Station on `,
                        via: "stationxnetwork",
                      }}
                      url={`${window.location.origin}/join/${daoAddress}`}
                    />

                    <LensterShareButton
                      daoAddress={daoAddress}
                      message="Just created a Station on StationX"
                    />
                  </div>
                </div>
              </Grid>
            )}
            {isCreating && (
              <button
                onClick={createLegalEntityHandler}
                className={classes.btn}>
                Let&apos;s Start
              </button>
            )}
            {isSuccess && (
              <button onClick={dashboardHandler} className={classes.btn}>
                Dashboard
              </button>
            )}
            <IoMdClose onClick={onClose} className={classes.icon} size={20} />
          </div>
        </div>
      </BackdropLoader>
    </>
  );
};

export default LegalEntityModal;
