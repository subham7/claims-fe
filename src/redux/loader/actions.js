export const START_LOADING = "START_LOADING";
export const STOP_LOADING = "STOP_LOADING";

export const startLoading = (key) => ({
  type: START_LOADING,
  payload: key,
});

export const stopLoading = (key) => ({
  type: STOP_LOADING,
  payload: key,
});
