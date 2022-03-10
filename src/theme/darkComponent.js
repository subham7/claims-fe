export const darkComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        background: "#242424 0% 0% no-repeat padding-box",
        "&:hover": {
          boxShadow:
            "inset 0rem 0.2rem 0.2rem rgba(255,255,255,0.2), inset 0rem -0.2rem 0.2rem rgba(0, 0, 0, 0.3), 0rem 0.1rem 0.5rem rgba(0, 0, 0, 0.4), 0rem -0.2rem 0.3rem rgba(255,255,255,0.3), 0rem 0.2rem 0.2rem rgba(0,0,0,0.2)",
          background: "#fff",
        },
        boxShadow: "-3px -3px 6px #FFFFFF29",
        borderRadius: " 10px",
        opacity: 1,
        padding: "10px 30px",
        color: "#3B7AFD",
        textTransform: "none",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        boxShadow:
          "0.3rem 0.3rem 0.5rem rgba(0, 0, 0, 0.3), -0.2rem -0.2rem 0.6rem rgba(255,255,255,0.1)",
        padding: "20px",
        backgroundColor: "#242424",
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: { boxShadow: "none", backgroundColor: "#191919" },
    },
  },
}
