import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listSite : [],
  listDevice: [],
  listGroup : [],
  listSchdules : [],
};

const smartstreetlightSlice = createSlice({
  name: "smartstreetlightData",
  initialState,
  reducers: {
    setListSite: (state, action) => {
      state.listSite = action.payload;
    },
    setListDevice : (state, action) => {
      state.listDevice = action.payload;
    },
    setListGroup: (state, action) => {
      state.listGroup = action.payload;
    },
    setListSchedules : (state, action) => {
      state.listSchdules = action.payload;
    },

  },
});

export const { setListSite, setListDevice , setListGroup , setListSchedules } = smartstreetlightSlice.actions;

export default smartstreetlightSlice.reducer;
