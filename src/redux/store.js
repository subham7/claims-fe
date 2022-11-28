import { configureStore } from "@reduxjs/toolkit";
import createReducer from "./reducers/create";
import gnosisReducer from "./reducers/gnosis";

export default configureStore({
  reducer: {
    create: createReducer,
    gnosis: gnosisReducer,
  },
});
