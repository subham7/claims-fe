import { Card, InputAdornment } from "@mui/material";
import { TextField, Typography } from "@components/ui";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ERC20Step2Styles } from "./CreateClubStyles";

export default function ERC20Step2(props) {
  const classes = ERC20Step2Styles();

  return (
    <>
      <div className="f-d f-vt t-pad-d">
        <Typography variant="body" className="text-blue">
          Set deposit rules for members
        </Typography>

        <Typography variant="info" className="text-darkblue tb-pad-1">
          Members automatically receive pro-rata tokens after depositing to join
          this Station. Any new deposits will not be accepted after the last
          date and/or funding target is met.
        </Typography>

        <Card className={classes.cardPadding} mb={2}>
          <div className="f-d f-v-c f-h-sb tb-pad-1 lr-pad-1">
            <div>
              <Typography variant="body" className="text-blue">
                Last date for members to deposit & join
              </Typography>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={props.formik.values.depositClose}
                minDateTime={dayjs(Date.now())}
                onChange={(value) => {
                  props.formik.setFieldValue("depositClose", value);
                }}
              />
            </LocalizationProvider>
          </div>
        </Card>

        <br />

        <Card className={classes.cardPadding} mb={2}>
          <div className="f-d f-v-c f-h-sb lr-pad-1 tb-pad-1">
            <div>
              <Typography variant="body" className="text-blue">
                Min. deposit amount per wallet *
              </Typography>
            </div>
            <div className="w-50">
              <TextField
                name="minDepositPerUser"
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
                onWheel={(event) => event.target.blur()}
              />
            </div>
          </div>
        </Card>

        <br />

        <Card className={classes.cardPadding} mb={2}>
          <div className="f-d f-v-c f-h-sb lr-pad-1 tb-pad-1">
            <div>
              <Typography variant="body" className="text-blue">
                Max. deposit amount per wallet *
              </Typography>
            </div>
            <div className="w-50">
              <TextField
                name="maxDepositPerUser"
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
                onWheel={(event) => event.target.blur()}
              />
            </div>
          </div>
        </Card>

        <br />

        <Card className={classes.cardPadding} mb={2}>
          <div className="f-d f-v-c f-h-sb lr-pad-1 tb-pad-1">
            <div>
              <Typography variant="body" className="text-blue">
                Total amount your Station is raising *
              </Typography>
            </div>
            <div className="w-50">
              <TextField
                name="totalRaiseAmount"
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
                onWheel={(event) => event.target.blur()}
              />
            </div>
          </div>
        </Card>

        <br />

        <Card className={classes.cardPadding} mb={2}>
          <div className="f-d f-v-c f-h-sb lr-pad-1 tb-pad-1">
            <div>
              <Typography variant="body" className="text-blue">
                Price per token *
              </Typography>
            </div>
            <div className="w-50">
              <TextField
                name="pricePerToken"
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
                onWheel={(event) => event.target.blur()}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
