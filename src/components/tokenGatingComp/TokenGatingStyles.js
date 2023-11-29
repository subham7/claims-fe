import { makeStyles } from "@mui/styles";

export const TokenGatingStyle = makeStyles({
  container: {
    background: "#151515",
    width: "70%",
    borderRadius: "12px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    marginBottom: "60px",
  },

  heading: {
    fontSize: "24px !important",
    marginBottom: "30px  !important",
    fontFamily: "inherit  !important",
    fontWeight: "500  !important",
  },

  title: {
    fontSize: "32px",
  },

  icon: {
    border: "0.5px solid #6475A3",
    padding: "6px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  conditions: {
    padding: "32px 20px",
    border: "1px solid #6475A350",
    borderRadius: "8px",
    width: "full",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  conditionTxt: {
    color: "gray",
    fontSize: "18px",
  },

  addBtn: {
    color: "inherit",
    background: "#2D55FF",
    height: "40px",
    width: "40px",
    borderRadius: "50px",
    fontSize: "30px",
    border: "none",
    cursor: "pointer",
  },

  match: {
    display: "flex",
    alignItems: "center",
  },

  switchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    color: "gray",
  },

  tokensList: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  inputList: {
    backgroundColor: "#ffffff",
  },
});
