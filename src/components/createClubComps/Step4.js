import {
  Card,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Step4Styles } from "./CreateClubStyles";

export default function Step4(props) {
  const classes = Step4Styles();

  return (
    <>
      <Grid container spacing={3} minHeight={"400px"}>
        <Grid item md={12} mt={8}>
          <Typography className={classes.largeText} mt={3} mb={2}>
            Treasury
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
                  Do you want to deploy a new safe?
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
                      checked={props.formik.values.deploySafe}
                      // onChange={handleOperationTypeChange}
                      disabled
                      sx={{
                        cursor: "not-allowed",
                      }}
                      onChange={(value) => {
                        props.formik.setFieldValue(
                          "deploySafe",
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

          {!props.formik.values.deploySafe && (
            <>
              <Typography mt={5} className={classes.wrapTextIcon}>
                Enter Safe address
              </Typography>
              <TextField
                name="safeAddress"
                className={classes.textField}
                label="Safe address"
                variant="outlined"
                placeholder="0x00"
                onChange={props.formik.handleChange}
                onBlur={props.formik.handleBlur}
                value={props.formik.values.safeAddress}
                error={
                  props.formik.touched.safeAddress &&
                  Boolean(props.formik.errors.safeAddress)
                }
                helperText={
                  props.formik.touched.safeAddress &&
                  props.formik.errors.safeAddress
                }
              />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
