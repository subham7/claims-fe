import { Grid, IconButton, TextField } from "@mui/material";
import { Button } from "@components/ui";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

const SurveyProposalForm = ({ proposal }) => {
  return (
    <>
      {proposal.values.optionList?.length > 0 ? (
        <Grid
          container
          mt={2}
          mb={2}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}>
          {proposal.values.optionList.map((data, key) => {
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
                  label="Options"
                  // error={!/^0x[a-zA-Z0-9]+/gm.test(addressList[key])}
                  variant="outlined"
                  value={proposal.values.optionList[key].text}
                  onChange={(e, value) => {
                    const option = e.target.value;
                    const list = [...proposal.values.optionList];
                    list[key].text = option;
                    proposal.setFieldValue("optionList", list);
                  }}
                  placeholder={"yes, no"}
                  sx={{
                    m: 1,
                    mt: 1,
                    borderRadius: "10px",
                  }}
                  error={
                    Boolean(proposal.errors.optionList)
                      ? proposal.touched.optionList &&
                        Boolean(proposal?.errors?.optionList[key])
                      : null
                  }
                  helperText={
                    Boolean(proposal.errors.optionList)
                      ? proposal.touched.optionList &&
                        proposal?.errors?.optionList[key]
                      : null
                  }
                />
                <IconButton
                  aria-label="add"
                  disabled={
                    proposal.values.optionList.indexOf(
                      proposal.values.optionList[key],
                    ) < 2
                  }
                  onClick={(value) => {
                    const list = [...proposal.values.optionList];
                    list.splice(key, 1);
                    proposal.setFieldValue("optionList", list);
                  }}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            );
          })}
        </Grid>
      ) : null}
      <Button
        onClick={(value) => {
          proposal.setFieldValue("optionList", [
            ...proposal.values.optionList,
            { text: "" },
          ]);
        }}>
        Add Option
      </Button>
    </>
  );
};

export default SurveyProposalForm;
