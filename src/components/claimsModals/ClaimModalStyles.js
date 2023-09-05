import { makeStyles } from "@mui/styles";

export const ClaimModalStyles = makeStyles({
  card: {
    width: "650px",
    background: "#0F0F0F",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 2002,
    padding: "60px 32px",
    borderRadius: "20px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
  },
  backdrop: {
    position: "fixed",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    background: "#fff",
    opacity: 0.4,
    zIndex: 2000,
  },

  title: {
    letterSpacing: "0.4px",

    fontSize: "28px",
  },
  subtitle: {
    color: "#C1D3FF",
    fontSize: "14px",
    marginBottom: "20px",
  },

  tokenInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: "#142243",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    padding: "30px",
  },

  tokenInput: {
    fontSize: "40px",
    color: "#fff",
    background: "transparent",
    border: "none",
    outline: "none",
    width: "340px",
  },
  balanceContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
  smallText: {
    fontSize: "14px",
    color: "#C1D3FF",
  },
  submitBtn: {
    padding: "6px 24px",
    borderRadius: "50px",
    border: "none",
    cursor: "pointer",
    background: "#2D55FF",
    color: "#fff",
  },
  buttonContainers: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  input: {
    width: "100%",
    marginTop: "6px",
    color: "#6475A3",
    borderRadius: "8px",
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  label: {
    marginTop: "30px",
    fontSize: "16px",
    fontWeight: "300",
    marginBottom: "4px",
  },

  dateInput: {
    width: "100%",
    marginTop: "6px",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "6px",
    padding: "12px 20px",
    outline: "none",
    border: "1px solid #C1D3FF40",
    background: "transparent",
  },
});
