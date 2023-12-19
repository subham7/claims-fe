import {
  Autocomplete,
  Box,
  Card,
  IconButton,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { TextField, Typography } from "@components/ui";

import CustomSlider from "../slider";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { Step3Styles } from "./CreateClubStyles";
import Web3 from "web3";
import { useEffect } from "react";
import { getSafeSdk } from "../../utils/helper";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { CHAIN_CONFIG } from "utils/constants";

export default function Step3(props) {
  const classes = Step3Styles();
  const { address: walletAddress } = useAccount();

  const [ownerAddresses, setOwnerAddresses] = useState();
  const [allSafeAddresses, setAllSafeAddresses] = useState();

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const fetchOwners = async (gnosisAddress) => {
    try {
      const { safeSdk } = await getSafeSdk(
        gnosisAddress,
        walletAddress,
        "",
        networkId,
      );

      const owners = await safeSdk.getOwners();

      const ownerAddressesArray = owners?.map((value) =>
        Web3.utils.toChecksumAddress(value),
      );

      setOwnerAddresses(ownerAddressesArray);
    } catch (e) {
      console.error(e);
    }
  };

  const getAllSafes = async () => {
    try {
      const { safeService } = await getSafeSdk(
        "",
        walletAddress,
        CHAIN_CONFIG[networkId].gnosisTxUrl,
        networkId,
      );
      const safes = await safeService.getSafesByOwner(walletAddress);
      setAllSafeAddresses(safes?.safes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (props.formik.values.deploySafe === "oldSafe") getAllSafes();
  }, [props.formik.values.deploySafe]);

  useEffect(() => {
    if (props.formik.values.safeAddress?.length)
      fetchOwners(props.formik.values.safeAddress);
  }, [props.formik.values.safeAddress]);

  return (
    <div className="f-d f-vt t-pad-d w-100">
      <Typography variant="body" className="text-blue">
        Collectively manage your club’s investments through governance that
        works for you.
      </Typography>
      <br />
      <Typography variant="body" className="text-blue b-pad-1">
        Configure Treasury
      </Typography>
      <Typography variant="body" className="text-light-gray">
        Where do you want to store funds/assets of this station?
      </Typography>

      <ToggleButtonGroup
        color="primary"
        value={props.formik.values.deploySafe}
        exclusive
        onChange={props.formik.handleChange}
        aria-label="deploySafe"
        name="deploySafe"
        id="deploySafe"
        className="tb-pad-1"
        // className={classes.selectContainer}
      >
        <ToggleButton
          className={classes.rightContainer}
          name="deploySafe"
          value="newSafe"
          id="deploySafe">
          Create a new multisig wallet
        </ToggleButton>
        <ToggleButton
          className={classes.leftContainer}
          name="deploySafe"
          id="deploySafe"
          value="oldSafe">
          I already have a multisig wallet
        </ToggleButton>
      </ToggleButtonGroup>

      {/* {props.formik.values.deploySafe} */}
      {props.formik.values.deploySafe === "oldSafe" &&
        allSafeAddresses?.length > 0 && (
          <>
            <Typography variant="body" className="text-blue t-pad-d">
              Select from existing multi-sig wallet(s)
            </Typography>
            <Autocomplete
              name="safeAddress"
              className={classes.textField}
              options={allSafeAddresses}
              onChange={(e, newValue) => {
                props.formik.setFieldValue("safeAddress", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  name="safeAddress"
                  {...params}
                  label="Safe address"
                  variant="outlined"
                  placeholder="0x00"
                  error={
                    props.formik.touched.safeAddress &&
                    Boolean(props.formik.errors.safeAddress)
                  }
                  helperText={
                    props.formik.touched.safeAddress &&
                    props.formik.errors.safeAddress
                  }
                />
              )}
            />

            <p
              style={{
                margin: "0",
                color:
                  props.ownerHelperText ===
                    "Owners of the safe does not match with the admins of the DAO" ||
                  props.ownerHelperText === "Invalid gnosis address"
                    ? "red"
                    : "#dcdcdc",
              }}>
              {props.ownerHelperText}
            </p>
          </>
        )}

      {props.formik.values.deploySafe === "oldSafe" &&
        props.formik.values.safeAddress?.length > 0 && (
          <>
            <Typography variant="body" className="text-blue">
              Signators
            </Typography>
            {ownerAddresses?.length > 0 ? (
              <div className="f-d f-vt">
                {ownerAddresses.map((data, key) => {
                  return (
                    <>
                      <div className="f-d f-v-c tb-pad-1">
                        <TextField
                          label="Owner address"
                          // error={!/^0x[a-zA-Z0-9]+/gm.test(addressList[key])}
                          variant="outlined"
                          value={ownerAddresses[key]}
                          placeholder={"0x"}
                        />
                        <IconButton
                          aria-label="add"
                          onClick={(value) => {
                            const list = [...props.formik.values.addressList];
                            list.splice(key, 1);
                            props.formik.setFieldValue("addressList", list);
                          }}
                          disabled>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </>
                  );
                })}
              </div>
            ) : null}
          </>
        )}

      <br />
      {props.formik.values.deploySafe === "newSafe" && (
        <>
          <Typography variant="body" className="text-blue">
            Wallet Signators
          </Typography>

          <Card className="tb-pad-0 b-mar-1">
            <div className="tb-pad-1 ">
              <div className="f-d f-v-c f-h-sb">
                <div>
                  <Typography variant="body" className="text-blue">
                    Add more wallets that will sign & approve transactions
                  </Typography>
                </div>
                <div>
                  <IconButton
                    aria-label="add"
                    onClick={(value) => {
                      props.formik.setFieldValue("addressList", [
                        ...props.formik.values.addressList,
                        "",
                      ]);
                    }}>
                    <AddCircleOutlinedIcon
                      className={classes.addCircleColour}
                    />
                  </IconButton>
                </div>
              </div>

              {props.formik.values.addressList?.length > 0 ? (
                <div>
                  {props.formik.values.addressList.map((data, key) => {
                    return (
                      <>
                        <div className="f-d f-v-c">
                          <TextField
                            label="Wallet address"
                            variant="outlined"
                            value={props.formik.values.addressList[key]}
                            onChange={(e, value) => {
                              const address = e.target.value;
                              const list = [...props.formik.values.addressList];
                              list[key] = address;
                              props.formik.setFieldValue("addressList", list);
                            }}
                            placeholder={"0x"}
                            error={
                              Boolean(props.formik.errors.addressList)
                                ? props.formik.touched.addressList &&
                                  Boolean(
                                    props.formik?.errors?.addressList[key],
                                  )
                                : null
                            }
                            helperText={
                              Boolean(props.formik.errors.addressList)
                                ? props.formik.touched.addressList &&
                                  props.formik?.errors?.addressList[key]
                                : null
                            }
                            disabled={key === 0}
                          />
                          <IconButton
                            aria-label="add"
                            onClick={(value) => {
                              const list = [...props.formik.values.addressList];
                              list.splice(key, 1);
                              props.formik.setFieldValue("addressList", list);
                            }}
                            disabled={key === 0}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </Card>

          <br />

          {props.formik.values.addressList?.length ? (
            <div>
              <div>
                <Typography variant="body" className="text-blue">
                  Min.{" "}
                  <Box
                    sx={{ color: "#2D55FF" }}
                    fontWeight="fontWeightBold"
                    display="inline">
                    number of signature needed
                  </Box>{" "}
                  to execute a proposal{" "}
                  <Box fontWeight="fontWeightBold" display="inline">
                    (Safe threshold)
                  </Box>{" "}
                </Typography>
              </div>
              <Card className="b-mar-1">
                <div className="tb-pad-1 lr-pad-1">
                  <Slider
                    defaultValue={1}
                    step={1}
                    marks
                    min={1}
                    valueLabelDisplay={"on"}
                    max={props.formik.values.addressList?.length}
                    onChange={(value) => {
                      props.formik.setFieldValue(
                        "safeThreshold",
                        value.target.value,
                      );
                    }}
                    value={props.formik.values.safeThreshold}
                  />
                </div>
              </Card>
            </div>
          ) : (
            ""
          )}
        </>
      )}

      <br />

      <Typography variant="body" className="text-blue">
        Governance
      </Typography>
      <Typography variant="info" className="text-light-gray">
        Who can create transaction(s) inside your station?
      </Typography>

      <ToggleButtonGroup
        color="primary"
        value={props.formik.values.governance}
        exclusive
        onChange={props.formik.handleChange}
        aria-label="governance"
        name="governance"
        id="governance"
        className="b-pad-1">
        <ToggleButton
          className={classes.rightContainer}
          name="governance"
          value="non-governance"
          id="governance">
          Admin(s) only
        </ToggleButton>
        <ToggleButton
          className={classes.leftContainer}
          name="governance"
          id="governance"
          value="governance">
          Community governance
        </ToggleButton>
      </ToggleButtonGroup>
      <br />
      {props.formik.values.governance === "governance" ? (
        <>
          <div>
            <Typography className={classes.largeText2}>
              Min.{" "}
              <Box
                sx={{ color: "#2D55FF" }}
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
          </div>
          <Card className="b-mar-1">
            <div className="tb-pad-1 lr-pad-1">
              <CustomSlider
                onChange={(value) => {
                  props.formik.setFieldValue("quorum", value.target.value);
                }}
                // onChange={onSetVoteForQuorum}
                value={props.formik.values.quorum}
                min={1}
              />
            </div>
          </Card>
          <br />

          <div>
            <Typography variant="body">
              Min.{" "}
              <Box
                sx={{ color: "#2D55FF" }}
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
          </div>
          <Card className="b-mar-1">
            <div className="tb-pad-1 lr-pad-1">
              <CustomSlider
                onChange={(value) => {
                  props.formik.setFieldValue("threshold", value.target.value);
                }}
                // onChange={onSetVoteOnFavourChange}
                value={props.formik.values.threshold}
                // defaultValue={voteInFavour}
                min={51}
                max={100}
              />
            </div>
          </Card>
        </>
      ) : null}
      <br />
    </div>
  );
}
