export const darkComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        background: "#3181F6",
        "&:hover": {},
        borderRadius: "10px",
        opacity: 1,
        padding: "10px 30px",
        color: "#fff",
        textTransform: "none",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        background: "#19274B",
        borderRadius: "20px",
        padding: "20px",
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        backgroundColor: "#142243",
        backgroundImage: "none",
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      thumb: {
        color: "#3B7AFD",
      },
      track: {
        "&:checked": {
          backgroundColor: "#3B7AFD",
        },
      },
    },
  }
}
