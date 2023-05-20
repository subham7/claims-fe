import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "proposal",
  initialState: {
    proposalList: [],
  },
  reducers: {
    setProposalList: (state, action) => {
      state.proposalList = action.payload;
    },
  },
});

export const { proposalList, setProposalList } = slice.actions;

export default slice.reducer;
