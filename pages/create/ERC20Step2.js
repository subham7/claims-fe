import {
  Card,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const useStyles = makeStyles({
  textField: {
    width: "100%",
    margin: "16px 0 25px 0",
    fontSize: "18px",
    fontFamily: "Whyte",
  },
  image: {
    width: "22.9vw",
    height: "61.8vh",
    borderRadius: "20px",
  },
  largeText: {
    fontSize: "18px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  largeText1: {
    fontSize: "2.4vw",
    color: "#FFFFFF",
    fontFamily: "Whyte",
  },
  wrapTextIcon: {
    fontSize: "18px",
    fontFamily: "Whyte",
    color: "#C1D3FF",
    verticalAlign: "middle",
    display: "inline-flex",
  },
  smallText: {
    fontSize: "14px",
    fontFamily: "Whyte",
  },
  cardWarning: {
    backgroundColor: "#FFB74D0D",
    borderRadius: "10px",
    opacity: 1,
  },
  textWarning: {
    textAlign: "left",
    color: "#FFB74D",
    fontSize: "14px",
    fontFamily: "Whyte",
  },
  boldText: {
    fontWeight: "bold",
    fontFamily: "Whyte",
  },
  uploadButton: {
    backgroundColor: "#111D38",
    color: "#3B7AFD",
    fontSize: "18px",
    width: "208px",
    fontFamily: "Whyte",
  },
  cardPadding: {
    margin: 0,
    padding: 0,
    borderRadius: "10px",
  },
  addCircleColour: {
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  large_button: {
    fontSize: "18px",
    width: "208px",
    borderRadius: "30px",
    fontFamily: "Whyte",
  },
  backButton: {
    fontSize: "18px",
    width: "208px",
    borderRadius: "30px",
    backgroundColor: "#FFFFFF",
    color: "#3B7AFD",
    fontFamily: "Whyte",
  },
  smallText: {
    fontSize: "16px",
    fontFamily: "Whyte",
    color: "#6475A3",
  },
});

export default function ERC20Step2(props) {
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} mt={8}>
          <Typography className={classes.largeText} mt={3} mb={2}>
            Set deposit rules for members
          </Typography>
          <Typography className={classes.smallText} mb={2}>
            Any new deposits will not be accepted after the last date and/or
            funding target is met. Admins can extend deposit dates from
            dashboard by an onchain transaction requiring gas.
          </Typography>
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography className={classes.largeText}>
                  Last date for members to deposit & join
                </Typography>
              </Grid>

              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: "1rem 0",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={props.formik.values.depositClose}
                    minDateTime={dayjs(Date.now())}
                    onChange={(value) => {
                      props.formik.setFieldValue(
                        "depositClose",
                        dayjs(value).format(),
                      );
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
          <br />

          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography className={classes.largeText}>
                  Min. deposit amount per wallet
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TextField
                  name="minDepositPerUser"
                  className={classes.textField}
                  type="number"
                  placeholder="Ex:100"
                  variant="outlined"
                  onChange={props.formik.handleChange}
                  onBlur={props.formik.handleBlur}
                  value={props.formik.values.minDepositPerUser}
                  error={
                    props.formik.touched.minDepositPerUser &&
                    Boolean(props.formik.errors.minDepositPerUser)
                  }
                  helperText={
                    props.formik.touched.minDepositPerUser &&
                    props.formik.errors.minDepositPerUser
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ color: "#C1D3FF" }}>
                        USDC
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Card>
          <br />

          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography className={classes.largeText}>
                  Max. deposit amount per wallet
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TextField
                  name="maxDepositPerUser"
                  className={classes.textField}
                  type="number"
                  placeholder="Ex:1000"
                  variant="outlined"
                  onChange={props.formik.handleChange}
                  onBlur={props.formik.handleBlur}
                  value={props.formik.values.maxDepositPerUser}
                  error={
                    props.formik.touched.maxDepositPerUser &&
                    Boolean(props.formik.errors.maxDepositPerUser)
                  }
                  helperText={
                    props.formik.touched.maxDepositPerUser &&
                    props.formik.errors.maxDepositPerUser
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ color: "#C1D3FF" }}>
                        USDC
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Card>

          <br />

          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography className={classes.largeText}>
                  Total amount your Station is raising
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TextField
                  name="totalRaiseAmount"
                  className={classes.textField}
                  type="number"
                  placeholder="Ex:1000"
                  variant="outlined"
                  onChange={props.formik.handleChange}
                  onBlur={props.formik.handleBlur}
                  value={props.formik.values.totalRaiseAmount}
                  error={
                    props.formik.touched.totalRaiseAmount &&
                    Boolean(props.formik.errors.totalRaiseAmount)
                  }
                  helperText={
                    props.formik.touched.totalRaiseAmount &&
                    props.formik.errors.totalRaiseAmount
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ color: "#C1D3FF" }}>
                        USDC
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Card>

          <br />

          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography className={classes.largeText}>
                  Price per token
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TextField
                  name="pricePerToken"
                  className={classes.textField}
                  type="number"
                  placeholder="Ex:10"
                  variant="outlined"
                  onChange={props.formik.handleChange}
                  onBlur={props.formik.handleBlur}
                  value={props.formik.values.pricePerToken}
                  error={
                    props.formik.touched.pricePerToken &&
                    Boolean(props.formik.errors.pricePerToken)
                  }
                  helperText={
                    props.formik.touched.pricePerToken &&
                    props.formik.errors.pricePerToken
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ color: "#C1D3FF" }}>
                        USDC
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
