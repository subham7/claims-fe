import { makeStyles } from "@mui/styles";

export const TokenGatingModalStyles = makeStyles({
  container: {
    background: "#101D38",
    width: "600px",
    borderRadius: "20px",
    padding: "70px 30px",
    border: "0.5px solid #6475A3",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: "1000",
  },

  backdrop: {
    position: "fixed",
    top: "0",
    left: "0",
    height: "100vh",
    width: "100vw",
    background: "#fff",
    opacity: "30%",
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
    marginBottom: "5px",
  },

  btns: {
    alignSelf: "flex-end",
    justifySelf: "flex-end",
  },

  cancelBtn: {
    background: "#101D38",
    border: "0.5px solid #6475A3",
    borderRadius: "50px",
    width: "150px",
    marginRight: "10px",
  },

  addBtn: {
    background: "#3A7AFD",
    border: "none",
    borderRadius: "50px",
    width: "150px",
    color: "white",
    "&:hover": {
      background: "#3A7AFD90",
    },
  },
});
