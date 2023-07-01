import { makeStyles } from "@mui/styles";

export const NewArchERC721Styles = makeStyles({
  topGrid: {
    paddingLeft: "6em",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconColor: {
    fontSize: "1rem",
    color: "#C1D3FF",
  },

  nftImg: {
    height: "auto",
    width: "100%",
    borderRadius: "20px",
  },
  depositActive: {
    background: "#0ABB9240",
    color: "#0ABB92",
    padding: "0.3em 0.5em",
    borderRadius: "0.3em",
    display: "flex",
    alignItems: "center",
  },
  clubName: {
    color: "white",
    fontWeight: "bold",
    width: "100%",
  },
  createdBy: {
    background: "#142243",
    color: "white",
    padding: "0.3em 0.5em",
    borderRadius: "6px",
  },

  quoramTxt: {
    color: "#fff",
    fontWeight: "light",
  },

  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
    marginRight: 3,
  },

  depositInactive: {
    background: "#D5533840",
    color: "#D55338",
    padding: "0.3em 0.5em",
    borderRadius: "0.3em",
    display: "flex",
    alignItems: "center",
  },

  executedIllustration: {
    height: "10px",
    width: "10px",
    backgroundColor: "#D55338",
    borderRadius: "50%",
    marginRight: 4,
  },

  claimGrid: {
    display: "flex",
    justifyContent: "flex-start",
    border: "1px solid #C1D3FF40",
    borderRadius: "8px",
    alignItems: "center",
    // background: "#142243",
    padding: "1em 1.3em",
  },

  maxTokensTxt: {
    color: "#FFF",
    fontWeight: "lighter",
  },

  connectWalletTxtGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
