import {
  Card,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ERC20Step2Styles } from "./CreateClubStyles";

export default function ERC20Step2(props) {
  const classes = ERC20Step2Styles();

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
                }}>
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
                }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={props.formik.values.depositClose}
                    minDateTime={dayjs(Date.now())}
                    onChange={(value) => {
                      props.formik.setFieldValue("depositClose", value);
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
                }}>
                <Typography className={classes.largeText}>
                  Min. deposit amount per wallet *
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
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
                }}>
                <Typography className={classes.largeText}>
                  Max. deposit amount per wallet *
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
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
                }}>
                <Typography className={classes.largeText}>
                  Total amount your Station is raising *
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
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
                }}>
                <Typography className={classes.largeText}>
                  Price per token *
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}>
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
