import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listSite : [],
  listDevice: [],
  listGroup : [],
  listSchdules : [],
  siteId : 0,
  groupId : 0 ,
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
    setSiteId: (state, action) => {
      state.siteId = action.payload;  // เปลี่ยนแปลงค่า id
    },
    setGroupId: (state, action) => {
      state.groupId = action.payload;  // เปลี่ยนแปลงค่า id
    },
    clearAll: (state) => {
      // Reset state to initial values
      state.listSite = [];
      state.listDevice = [];
      state.listGroup = [];
      state.listSchdules = [];
      state.siteId = 0;
      state.groupId = 0;
    }

  },
});

export const { setListSite, setListDevice , setListGroup , setListSchedules , setSiteId , setGroupId ,clearAll} = smartstreetlightSlice.actions;

export default smartstreetlightSlice.reducer;
