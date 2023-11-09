import { configureStore } from "@reduxjs/toolkit";
import clubReducer from "./reducers/club";
import gnosisReducer from "./reducers/gnosis";
import legalReducer from "./reducers/legal";
import generalReducer from "./reducers/general";
import contractInstanceReducer from "./reducers/contractInstances";

export default configureStore({
  reducer: {
    contractInstances: contractInstanceReducer,
    club: clubReducer,
    gnosis: gnosisReducer,
    legal: legalReducer,
    general: generalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
