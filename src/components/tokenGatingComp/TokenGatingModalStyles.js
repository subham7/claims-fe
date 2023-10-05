import { makeStyles } from "@mui/styles";

export const TokenGatingModalStyles = makeStyles({
  container: {
    background: "#151515",
    width: "600px",
    borderRadius: "20px",
    padding: "70px 30px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: "1000",
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },

  input: {
    width: "100%",
    marginBottom: "24px",
  },

  label: {
    color: "white",
    fontSize: "18px",
    marginTop: "10px",
  },

  btns: {
    marginTop: "24px",
    alignSelf: "flex-end",
    justifySelf: "flex-end",
  },

  cancelBtn: {
    background: "#101D38",
    borderRadius: "50px",
    width: "150px",
    marginRight: "10px",
  },

  addBtn: {
    background: "#2D55FF",
    border: "none",
    borderRadius: "50px",
    width: "150px",
    color: "white",
    "&:hover": {
      background: "#2D55FF90",
    },
  },
});
