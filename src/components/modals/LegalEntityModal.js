import { Button, Grid, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { TwitterShareButton } from "react-twitter-embed";
import { IoMdClose } from "react-icons/io";

const useStyles = makeStyles({
  backdrop: {
    position: "fixed",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    background: "#000000",
    opacity: 0.85,
    zIndex: 2000,
  },
  modal: {
    width: "570px",
    background: "#111D38",
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
    fontFamily: "sans-serif",
    fontSize: "28px",
  },
  subtitle: {
    color: "#C1D3FF",
    fontSize: "16px",
    marginBottom: "6px",
  },
  btn: {
    background: "#3B7AFD",
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
      "transparent linear-gradient(90deg, #111D3800 0%, #3B7AFD 100%) 0% 0% no-repeat padding-box",
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
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "15px",
  },
  linkInput: {
    width: "100%",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
});

const Backdrop = ({ onClose }) => {
  const classes = useStyles();
  return <div onClick={onClose} className={classes.backdrop}></div>;
};

const LegalEntityModal = ({
  onClose,
  isCreating = false,
  isSuccess = false,
  isInvite = false,
  encryptedLink,
  isTwitter = false,
  daoAddress,
}) => {
  const [isCopy, setIsCopy] = useState(false);
  const classes = useStyles();
  const router = useRouter();

  const { clubId } = router.query;

  // create legal Entity
  const createLegalEntityHandler = () => {
    router.push("/legalEntity");
  };

  // back to dashboard
  const dashboardHandler = () => {
    // add dynamic link
    router.push("/dashboard/");
  };

  // copy link
  const copyHandler = () => {
    navigator.clipboard.writeText(
      typeof window !== "undefined" && window.location.origin
        ? `${window.location.origin}/dashboard/${clubId}/documents/sign/${encryptedLink}`
        : null,
    );
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 3000);
  };

  return (
    <>
      <Backdrop onClose={onClose} />
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
                      ? `${window.location.origin}/dashboard/${clubId}/documents/legal/${encryptedLink}`
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
              // xs={12}
              // md={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              mt={5}>
              {/* enter your code here */}

              <div className="centerContent">
                <div className="selfCenter spaceBetween">
                  <TwitterShareButton
                    onLoad={function noRefCheck() {}}
                    options={{
                      size: "large",
                      text: `Just created a Station on `,
                      via: "stationxnetwork",
                    }}
                    url={`https://test.stationx.network/join/${daoAddress}`}
                  />
                </div>
              </div>
            </Grid>
          )}
          {isCreating && (
            <button onClick={createLegalEntityHandler} className={classes.btn}>
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
    </>
  );
};

export default LegalEntityModal;
