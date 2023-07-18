import { makeStyles } from "@mui/styles";

export const TokenGatingStyle = makeStyles({
  container: {
    background: "#142243",
    marginLeft: "130px",
    width: "65%",
    borderRadius: "12px",
    padding: "50px 30px",
    display: "flex",
    flexDirection: "column",
  },

  heading: {
    display: "flex",
    color: "white",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "20px",
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
    background: "#3A7AFD",
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
    padding: "0px 16px",
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
