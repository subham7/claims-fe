import { makeStyles } from "@mui/styles";

export const ClaimsInsightStyles = makeStyles((theme) => ({
  mainContainer: {
    marginBottom: "60px",
    minHeight: "100vh",
  },
  claimInfoContainer: {
    width: "100%",
    display: "flex",
    gap: "30px",
  },
  leftContainer: {
    flex: 0.7,
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  infoTopContainer: {
    borderRadius: "10px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    background: "#151515",
  },

  infoBottomContainer: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },

  infoBottomLeftContainer: {
    flex: "0.65",
    borderRadius: "10px",
    background:
      "transparent linear-gradient(296deg, #6C63FF 0%, #363280 100%) 0% 0% no-repeat padding-box",
    padding: "30px",
  },
  infoBottomRightContainer: {
    flex: "0.35",
    borderRadius: "10px",
    padding: "30px",
    background:
      "transparent linear-gradient(310deg, #0ABB92 0%, #055E49 100%) 0% 0% no-repeat padding-box",
  },

  rightContainer: {
    flex: 0.3,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  gapContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },

  copyContainer: {
    display: "flex",
    justifyContent: "space-between",
    items: "center",
    gap: "20px",
    background: theme.palette.background.default,
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
  },

  toggleClaimContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0px 6px 20px",
    borderRadius: "10px",
    background: "#151515",
  },
  claimEditContainer: {
    padding: "20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    justifyContent: "space-between",
    borderRadius: "10px",
    minHeight: "140px",
    background: "#151515",
  },

  eligibilityContainer: {
    height: "100%",
    padding: "20px",
    borderRadius: "10px",
    background: "#151515",
  },

  eligibleToken: {
    display: "flex",
    width: "fit-content",
    gap: "10px",
    padding: "8px 10px",
    marginTop: "15px",
    borderRadius: "8px",
    background: "#151515",
  },
  icon: {
    background: theme.palette.background.default,
    padding: "3px",
    borderRadius: "5px",
    cursor: "pointer",
  },
}));
