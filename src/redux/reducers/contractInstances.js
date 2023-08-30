import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "contractInstances",
  initialState: {
    contractInstances: {
      factoryContractCall: null,
      erc20TokenContractCall: null,
      erc20TokenContractSend: null,
      erc20DaoContractCall: null,
      erc20DaoContractSend: null,
      erc721TokenContractCall: null,
      erc721DaoContractCall: null,
      erc721DaoContractSend: null,
      claimContractCall: null,
      claimFactoryContractCall: null,
    },
  },
  reducers: {
    setContractInstances: (state, action) => {
      state.contractInstances.factoryContractCall =
        action.payload.factoryContractCall;
      state.contractInstances.erc20TokenContractCall =
        action.payload.erc20TokenContractCall;
      state.contractInstances.erc20TokenContractSend =
        action.payload.erc20TokenContractSend;
      state.contractInstances.erc20DaoContractCall =
        action.payload.erc20DaoContractCall;
      state.contractInstances.erc20DaoContractSend =
        action.payload.erc20DaoContractSend;
      state.contractInstances.erc721DaoContractCall =
        action.payload.erc721DaoContractCall;
      state.contractInstances.erc721DaoContractSend =
        action.payload.erc721DaoContractSend;
      state.contractInstances.claimContractCall =
        action.payload.claimContractCall;
      state.contractInstances.claimFactoryContractCall =
        action.payload.claimFactoryContractCall;
      state.contractInstances.erc721TokenContractCall =
        action.payload.erc721TokenContractCall;
    },
  },
});

export const { setContractInstances } = slice.actions;
export default slice.reducer;
