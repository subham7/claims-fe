import { makeStyles } from "@mui/styles";

export const ClaimsInsightStyles = makeStyles({
  mainContainer: {
    width: "90%",
    margin: "90px auto 0px",
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
    border: ".5px solid #6475A3",
    borderRadius: "10px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
    gap: "10px",
  },

  copyContainer: {
    display: "flex",
    justifyContent: "space-between",
    items: "center",
    gap: "20px",
    background:
      "transparent linear-gradient(90deg, #19274B00 0%, #111D38 100%) 0% 0% no-repeat padding-box;",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    border: "0.5px solid #6475A3",
  },

  toggleClaimContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "0.5px solid #6475A3",
    padding: "6px 0px 6px 20px",
    borderRadius: "10px",
  },
  claimEditContainer: {
    padding: "20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    justifyContent: "space-between",
    borderRadius: "10px",
    border: "0.5px solid #6475A3",
    minHeight: "140px",
  },

  eligibilityContainer: {
    height: "100%",
    padding: "20px",
    borderRadius: "10px",
    border: "0.5px solid #6475A3",
  },
});
