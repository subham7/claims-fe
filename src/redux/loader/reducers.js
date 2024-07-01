// src/redux/loading/loadingReducer.js

import { START_LOADING, STOP_LOADING } from "./actions";

const initialState = {};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, [action.payload]: true };
    case STOP_LOADING:
      return { ...state, [action.payload]: false };
    default:
      return state;
  }
};

export default loadingReducer;
