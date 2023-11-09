import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "general",
  initialState: {
    open: null,
    message: null,
    severity: null,
  },
  reducers: {
    addAlertData: (state, action) => {
      state.open = action.payload.open;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
  },
});

export const { addAlertData } = slice.actions;

export default slice.reducer;
