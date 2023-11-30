import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "alert",
  initialState: {
    open: null,
    message: null,
    severity: null,
  },
  reducers: {
    setAlertData: (state, action) => {
      state.open = action.payload.open;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
  },
});

export const { setAlertData } = slice.actions;

export default slice.reducer;
