import { configureStore } from "@reduxjs/toolkit";
import clubReducer from "./reducers/club";
import gnosisReducer from "./reducers/gnosis";
import legalReducer from "./reducers/legal";
import contractInstanceReducer from "./reducers/contractInstances";

export default configureStore({
  reducer: {
    contractInstances: contractInstanceReducer,
    club: clubReducer,
    gnosis: gnosisReducer,
    legal: legalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
