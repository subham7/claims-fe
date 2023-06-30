import {
  Box,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import CustomSlider from "../slider";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { Step3Styles } from "./CreateClubStyles";
import { useConnectWallet } from "@web3-onboard/react";
import Web3 from "web3";

export default function Step3(props) {
  const classes = Step3Styles();
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet.accounts[0].address;
  const index = props.formik.values.addressList.indexOf(
    Web3.utils.toChecksumAddress(walletAddress),
  );
  if (index >= 0) props.formik.values.addressList.splice(index, 1);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} mt={5}>
          <Typography className={classes.largeText}>
            Collectively manage your club’s investments through governance that
            works for you.
          </Typography>
          <br />
          <Typography className={classes.largeText} mt={3} mb={2}>
            Governance
          </Typography>
          <Typography className={classes.smallText} mb={2}>
            Seamlessly raise/vote on proposals inside your Station to take
            opinions from members. Optionally, you can add governance to execute
            transactions if and only if a proposal passes among members
            (Transferring funds, distributing profits, airdropping assets,
            updating governance & more).
          </Typography>

          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={1} mb={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}>
                <Typography className={classes.largeText2}>
                  Do you want to enable Governance?
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={props.formik.values.governance}
                      // onChange={handleOperationTypeChange}
                      onChange={(value) => {
                        props.formik.setFieldValue(
                          "governance",
                          value.target.checked,
                        );
                      }}
                    />
                  }
                  label="NO / YES"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
          </Card>
          <br />

          {props.formik.values.governance ? (
            <>
              <Grid
                container
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                mt={2}
                mb={2}>
                <Typography className={classes.largeText2}>
                  Min.{" "}
                  <Box
                    sx={{ color: "#3B7AFD" }}
                    fontWeight="fontWeightBold"
                    display="inline">
                    % of votes needed
                  </Box>{" "}
                  to consider any proposal raised{" "}
                  <Box
                    sx={{ color: "#6475A3" }}
                    fontWeight="fontWeightBold"
                    display="inline">
                    (Quorum)
                  </Box>{" "}
                </Typography>
              </Grid>
              <Card container pl={3} pr={1} mt={2}>
                <Grid container item md={11.3} mt={3} ml={2} mb={1}>
                  <CustomSlider
                    onChange={(value) => {
                      props.formik.setFieldValue("quorum", value.target.value);
                    }}
                    // onChange={onSetVoteForQuorum}
                    value={props.formik.values.quorum}
                    min={1}
                  />
                </Grid>
              </Card>
              <br />
              <Grid
                container
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                // pl={3}
                pr={1}
                mt={2}
                mb={2}>
                <Typography className={classes.largeText2}>
                  Min.{" "}
                  <Box
                    sx={{ color: "#3B7AFD" }}
                    fontWeight="fontWeightBold"
                    display="inline">
                    % of votes needed
                  </Box>{" "}
                  out of all votes to pass a proposal{" "}
                  <Box
                    sx={{ color: "#6475A3" }}
                    fontWeight="fontWeightBold"
                    display="inline">
                    (Threshold)
                  </Box>{" "}
                </Typography>
              </Grid>
              <Card container pl={3} pr={1} mt={2}>
                <Grid container item md={11.3} mt={4} ml={4} mb={1}>
                  <CustomSlider
                    onChange={(value) => {
                      props.formik.setFieldValue(
                        "threshold",
                        value.target.value,
                      );
                    }}
                    // onChange={onSetVoteOnFavourChange}
                    value={props.formik.values.threshold}
                    // defaultValue={voteInFavour}
                    min={51}
                    max={100}
                  />
                </Grid>
              </Card>
            </>
          ) : null}
          <br />

          <Typography className={classes.largeText} mt={3} mb={2}>
            Assets on Gnosis
          </Typography>
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={1} mb={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}>
                <Typography className={classes.largeText2}>
                  Do you want to store assets on safe or contract?
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={props.formik.values.storeAssetsOnGnosis}
                      // onChange={handleOperationTypeChange}
                      onChange={(value) => {
                        props.formik.setFieldValue(
                          "storeAssetsOnGnosis",
                          value.target.checked,
                        );
                      }}
                    />
                  }
                  label="NO / YES"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
          </Card>
          <br />

          <Typography className={classes.largeText} mt={4} mb={2}>
            Wallet Signators
          </Typography>
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={2} mb={2}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}>
                <Typography className={classes.largeText}>
                  Add more wallets that will sign & approve transactions
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
                mr={3}>
                <IconButton
                  aria-label="add"
                  onClick={(value) => {
                    props.formik.setFieldValue("addressList", [
                      ...props.formik.values.addressList,
                      "",
                    ]);
                  }}>
                  <AddCircleOutlinedIcon className={classes.addCircleColour} />
                </IconButton>
              </Grid>
            </Grid>

            {props.formik.values.addressList?.length > 0 ? (
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                {props.formik.values.addressList.map((data, key) => {
                  return (
                    <Grid
                      item
                      xs
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                      key={key}>
                      <TextField
                        label="Wallet address"
                        // error={!/^0x[a-zA-Z0-9]+/gm.test(addressList[key])}
                        variant="outlined"
                        value={props.formik.values.addressList[key]}
                        onChange={(e, value) => {
                          const address = e.target.value;
                          const list = [...props.formik.values.addressList];
                          list[key] = address;
                          props.formik.setFieldValue("addressList", list);
                        }}
                        placeholder={"0x"}
                        sx={{
                          m: 1,
                          width: 443,
                          mt: 1,
                          borderRadius: "10px",
                        }}
                        error={
                          Boolean(props.formik.errors.addressList)
                            ? props.formik.touched.addressList &&
                              Boolean(props.formik?.errors?.addressList[key])
                            : null
                        }
                        helperText={
                          Boolean(props.formik.errors.addressList)
                            ? props.formik.touched.addressList &&
                              props.formik?.errors?.addressList[key]
                            : null
                        }
                      />
                      <IconButton
                        aria-label="add"
                        onClick={(value) => {
                          const list = [...props.formik.values.addressList];
                          list.splice(key, 1);
                          props.formik.setFieldValue("addressList", list);
                        }}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  );
                })}
              </Grid>
            ) : null}
          </Card>

          {props.formik.values.addressList.length ? (
            <>
              <Grid
                container
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                mt={5}
                mb={2}>
                <Typography className={classes.largeText2}>
                  Min.{" "}
                  <Box
                    sx={{ color: "#3B7AFD" }}
                    fontWeight="fontWeightBold"
                    display="inline">
                    number of signature needed
                  </Box>{" "}
                  to execute a proposal{" "}
                  <Box
                    sx={{ color: "#6475A3" }}
                    fontWeight="fontWeightBold"
                    display="inline">
                    (Safe threshold)
                  </Box>{" "}
                </Typography>
              </Grid>

              <Card container pl={3} pr={1} mt={2}>
                <Grid container item md={11.3} mt={3} ml={2} mb={1}>
                  <Slider
                    defaultValue={1}
                    step={1}
                    marks
                    min={1}
                    valueLabelDisplay={"on"}
                    max={props.formik.values.addressList.length + 1}
                    onChange={(value) => {
                      props.formik.setFieldValue(
                        "safeThreshold",
                        value.target.value,
                      );
                    }}
                    value={props.formik.values.safeThreshold}
                  />
                </Grid>
              </Card>
            </>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </>
  );
}
