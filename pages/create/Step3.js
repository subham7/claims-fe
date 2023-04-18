import {
  Box,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Field, FieldArray } from "formik";
import CustomSlider from "../../src/components/slider";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

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
  largeText2: {
    fontSize: "18px",
    color: "#FFFFFF",
    fontFamily: "Whyte",
  },
});

export default function Step3(props) {
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} mt={8}>
          <Typography className={classes.largeText}>
            Collectively manage your club’s investments through governance that
            works for you.
          </Typography>
          <br />
          <Typography className={classes.largeText} mt={3} mb={2}>
            Add governance
          </Typography>
          <Typography className={classes.smallText} mb={2}>
            Default mechanism is one wallet = one vote irrespective of number of
            tokens held. Stations can raise & vote proposals to conduct surveys,
            know community&apos;s sentiment & execute seamless actions (such a
            airdrop tokens, reward members, etc) required day-to-day.
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
                }}
              >
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
                }}
              >
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
                mb={2}
              >
                <Typography className={classes.largeText2}>
                  Min.{" "}
                  <Box
                    sx={{ color: "#3B7AFD" }}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    % of votes needed
                  </Box>{" "}
                  to consider any proposal raised{" "}
                  <Box
                    sx={{ color: "#6475A3" }}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
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
                mb={2}
              >
                <Typography className={classes.largeText2}>
                  Min.{" "}
                  <Box
                    sx={{ color: "#3B7AFD" }}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    % of votes needed
                  </Box>{" "}
                  out of all votes to pass a proposal{" "}
                  <Box
                    sx={{ color: "#6475A3" }}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
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
                }}
              >
                <Typography className={classes.largeText}>
                  Add more wallets that will sign & approve final transaction
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
                mr={3}
              >
                <IconButton
                  aria-label="add"
                  onClick={(value) => {
                    props.formik.setFieldValue("addressList", [
                      ...props.formik.values.addressList,
                      "",
                    ]);
                  }}
                >
                  <AddCircleOutlinedIcon className={classes.addCircleColour} />
                </IconButton>
              </Grid>
            </Grid>

            {props.formik.values.addressList?.length > 0 ? (
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                {console.log(props.formik.values.addressList)}
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
                      key={key}
                    >
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
                          console.log(list, key);

                          list.splice(key, 1);
                          console.log(list);
                          props.formik.setFieldValue("addressList", list);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  );
                })}
              </Grid>
            ) : null}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
