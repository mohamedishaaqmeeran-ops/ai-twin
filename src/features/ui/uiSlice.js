import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    pageLoading: false,
  },
  reducers: {
    showPageLoader: (state) => {
      state.pageLoading = true;
    },
    hidePageLoader: (state) => {
      state.pageLoading = false;
    },
  },
});

export const { showPageLoader, hidePageLoader } = uiSlice.actions;
export default uiSlice.reducer;