import {
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { TextField } from "@components/ui";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ERC20Step2Styles } from "./CreateClubStyles";
import { CHAIN_CONFIG } from "utils/constants";
import { getPriceRate } from "api/assets";
import { useEffect, useState } from "react";
import { MdInfo } from "react-icons/md";
import { getTokenSymbolFromAddress } from "utils/tokenHelper";

const PriceRateDiv = ({ currentUSDCRate, value }) => {
  return (
    <div
      style={{
        textAlign: "right",
        color: "#707070",
      }}>
      {Number(value) > 0 &&
        `
      ~ $${Number(currentUSDCRate * value).toFixed(2)}`}
    </div>
  );
};

export default function ERC20Step2(props) {
  const classes = ERC20Step2Styles();
  const [currentUSDCRate, setCurrentUSDCRate] = useState(0);

  const fetchPriceRate = async (symbol) => {
    try {
      const { data } = await getPriceRate(symbol);
      setCurrentUSDCRate(data.data.rates.USDC);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPriceRate(CHAIN_CONFIG[props.networkId].nativeCurrency.symbol);
  }, []);

  return (
    <>
      <div className="f-d f-vt t-pad-d w-100">
        <Typography
          fontSize={24}
          fontWeight={600}
          variant="body"
          className="text-blue">
          Contribution rules
        </Typography>

        <Typography
          fontSize={16}
          color={"#a0a0a0"}
          variant="info"
          className="text-light-gray tb-pad-1">
          Configure parameters to deposit into the station’s treasury. Members
          mint their share tokens by contributing funds (USDC or native
          currency) to your station.
        </Typography>

        <Card>
          <div className="f-d f-v-c f-h-sb">
            <div>
              <Typography fontWeight={600} variant="body" className="text-blue">
                Choose currency (mode of contribution)
              </Typography>
            </div>
            <div className="w-50">
              <FormControl fullWidth>
                <InputLabel>Token</InputLabel>
                <Select
                  id="depositToken"
                  name="depositToken"
                  value={props.formik.values.depositToken}
                  label="Token"
                  onChange={props.formik.handleChange}
                  fullWidth>
                  <MenuItem value={CHAIN_CONFIG[props.networkId].usdcAddress}>
                    USDC
                  </MenuItem>
                  <MenuItem value={CHAIN_CONFIG[props.networkId].usdtAddress}>
                    USDT
                  </MenuItem>
                  <MenuItem value={CHAIN_CONFIG[props.networkId].nativeToken}>
                    {" "}
                    {CHAIN_CONFIG[props.networkId].nativeCurrency.symbol}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </Card>

        <br />

        <Card>
          <div className="f-d f-v-c f-h-sb">
            <div>
              <Typography fontWeight={600} variant="body" className="text-blue">
                Minimum contribution per wallet
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
                      {getTokenSymbolFromAddress(props)}
                    </InputAdornment>
                  ),
                }}
                onWheel={(event) => event.target.blur()}
              />
              {CHAIN_CONFIG[props.networkId].nativeToken ===
                props.formik.values.depositToken && (
                <PriceRateDiv
                  currentUSDCRate={currentUSDCRate}
                  value={props.formik.values.minDepositPerUser}
                />
              )}
            </div>
          </div>
        </Card>

        <br />

        <Card mb={2}>
          <div className="f-d f-v-c f-h-sb">
            <div>
              <Typography fontWeight={600} variant="body" className="text-blue">
                Maximum contribution per wallet
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
                      {getTokenSymbolFromAddress(props)}
                    </InputAdornment>
                  ),
                }}
                onWheel={(event) => event.target.blur()}
              />
              {CHAIN_CONFIG[props.networkId].nativeToken ===
                props.formik.values.depositToken && (
                <PriceRateDiv
                  currentUSDCRate={currentUSDCRate}
                  value={props.formik.values.maxDepositPerUser}
                />
              )}
            </div>
          </div>
        </Card>

        <br />

        <Card>
          <div className="f-d f-v-c f-h-sb">
            <div>
              <Typography fontWeight={600} variant="body" className="text-blue">
                Fund raising goal
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
                      {getTokenSymbolFromAddress(props)}
                    </InputAdornment>
                  ),
                }}
                onWheel={(event) => event.target.blur()}
              />
              {CHAIN_CONFIG[props.networkId].nativeToken ===
                props.formik.values.depositToken && (
                <PriceRateDiv
                  currentUSDCRate={currentUSDCRate}
                  value={props.formik.values.totalRaiseAmount}
                />
              )}
            </div>
          </div>
        </Card>

        <br />

        <Card>
          <div className="f-d f-v-c f-h-sb">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography fontWeight={600} variant="body" className="text-blue">
                Contribution deadline
              </Typography>
              <Tooltip
                placement="bottom"
                title="Date on which you want to close the deposits. you can extend this date later on from the dashboard.">
                <div>
                  <MdInfo size={14} style={{ cursor: "pointer" }} />
                </div>
              </Tooltip>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={props.formik.values.depositClose}
                minDateTime={dayjs(Date.now()).locale("en")}
                onChange={(value) => {
                  props.formik.setFieldValue("depositClose", value);
                }}
              />
            </LocalizationProvider>
          </div>
        </Card>

        <br />

        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography fontWeight={600} variant="body" className="text-blue">
                Price per token
              </Typography>
              <Tooltip
                placement="bottom"
                title="Members receive shares as per their contribution to the station. These shares represent an onchain captable of members’ ownership inside the station.">
                <div>
                  <MdInfo size={14} style={{ cursor: "pointer" }} />
                </div>
              </Tooltip>
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
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="inherit" fontSize={16}>
                        1 ${props.tokenSymbol.toUpperCase()} ={" "}
                      </Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" sx={{ color: "#dcdcdc" }}>
                      {getTokenSymbolFromAddress(props)}
                    </InputAdornment>
                  ),
                }}
                onWheel={(event) => event.target.blur()}
              />
              {CHAIN_CONFIG[props.networkId].nativeToken ===
                props.formik.values.depositToken && (
                <PriceRateDiv
                  currentUSDCRate={currentUSDCRate}
                  value={props.formik.values.pricePerToken}
                />
              )}
            </div>
            {/* </div> */}
          </div>
        </Card>
        <br />
      </div>
    </>
  );
}
