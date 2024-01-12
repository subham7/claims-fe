import {
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { TextField, Typography } from "@components/ui";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ERC20Step2Styles } from "./CreateClubStyles";
import { CHAIN_CONFIG } from "utils/constants";

export default function ERC20Step2(props) {
  const classes = ERC20Step2Styles();

  return (
    <>
      <div className="f-d f-vt t-pad-d w-100">
        <Typography variant="body" className="text-blue">
          Set deposit rules for members
        </Typography>

        <Typography variant="info" className="text-light-gray tb-pad-1">
          Community members will receive membership token(s) when they join this
          station.
        </Typography>

        <Card>
          <div className="f-d f-v-c f-h-sb">
            <div>
              <Typography variant="body" className="text-blue">
                Deposit Token
              </Typography>
            </div>

            {/* <FormControl sx={{ width: "50%" }}>
              <Select
                value={props.formik.values.depositToken}
                onChange={props.formik.handleChange}
                inputProps={{ "aria-label": "Without label" }}
                name="depositToken"
                id="depositToken">
                <MenuItem value={CHAIN_CONFIG[props.networkId].usdcAddress}>
                  USDC
                </MenuItem>
                <MenuItem value={CHAIN_CONFIG[props.networkId].nativeToken}>
                  {CHAIN_CONFIG[props.networkId].nativeCurrency.symbol}
                </MenuItem>
              </Select>
            </FormControl> */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Token</InputLabel>
              <Select
                labelId="depositToken-label"
                id="depositToken"
                name="depositToken"
                value={props.formik.values.depositToken}
                label="Token"
                onChange={props.formik.handleChange}>
                <MenuItem value={CHAIN_CONFIG[props.networkId].usdcAddress}>
                  USDC
                </MenuItem>
                <MenuItem value={CHAIN_CONFIG[props.networkId].nativeToken}>
                  {" "}
                  {CHAIN_CONFIG[props.networkId].nativeCurrency.symbol}
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </Card>

        <br />

        <Card>
          <div className="f-d f-v-c f-h-sb">
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

        <Card>
          <div className="f-d f-v-c f-h-sb">
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
                    <InputAdornment position="end" sx={{ color: "#dcdcdc" }}>
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

        <Card mb={2}>
          <div className="f-d f-v-c f-h-sb">
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
                    <InputAdornment position="end" sx={{ color: "#dcdcdc" }}>
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

        <Card>
          <div className="f-d f-v-c f-h-sb">
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
                    <InputAdornment position="end" sx={{ color: "#dcdcdc" }}>
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

        <Card>
          <div className="f-d f-v-c f-h-sb">
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
                    <InputAdornment position="end" sx={{ color: "#dcdcdc" }}>
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
      </div>
    </>
  );
}
