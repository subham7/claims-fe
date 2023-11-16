import { configureStore } from "@reduxjs/toolkit";
import clubReducer from "./reducers/club";
import gnosisReducer from "./reducers/gnosis";
import legalReducer from "./reducers/legal";
import alertReducer from "./reducers/alert";

export default configureStore({
  reducer: {
    club: clubReducer,
    gnosis: gnosisReducer,
    legal: legalReducer,
    alert: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
