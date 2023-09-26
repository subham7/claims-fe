import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "contractInstances",
  initialState: {
    contractInstances: {
      erc20DaoContractCall: null,
      erc721DaoContractCall: null,
    },
  },
  reducers: {
    setContractInstances: (state, action) => {
      state.contractInstances.erc20DaoContractCall =
        action.payload.erc20DaoContractCall;
      state.contractInstances.erc721DaoContractCall =
        action.payload.erc721DaoContractCall;
    },
  },
});

export const { setContractInstances } = slice.actions;
export default slice.reducer;
