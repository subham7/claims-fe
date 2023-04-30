import { makeStyles } from "@mui/styles";

export const TokenGatingStyle = makeStyles({
  container: {
    background: "#142243",
    width: "1000px",
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
  },

  title: {
    fontSize: "32px",
  },

  icon: {
    border: "0.5px solid #6475A3",
    padding: "6px",
    borderRadius: "8px",
  },

  conditions: {
    padding: "20px",
    border: "1px solid #6475A350",
    borderRadius: "8px",
    width: "full",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  conditionTxt: {
    color: "gray",
    fontSize: "18px",
  },

  addBtn: {
    color: "inherit",
    background: "#C74988",
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
    alignItems: "center",
    gap: "20px",
    color: "gray",
  },

  saveBtn: {
    width: "150px",
    padding: "15px",
    borderRadius: "200px",
    border: "none",
    alignSelf: "flex-end",
    marginTop: "20px",
    color: "white",
    background: "#D83C8A",
    cursor: "pointer",
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
