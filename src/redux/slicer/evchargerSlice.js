import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  siteId: 0,
  siteName: "",
  stationId: 0,
  stationName: "",
  chargerId: 0,
  chargerName: "",
  chargeHeadId: 0,
  chargeHeadName: "",
};

const evchargerSlice = createSlice({
  name: "evchargerData",
  initialState,
  reducers: {
    setSiteId: (state, action) => {
      state.siteId = action.payload;
    },
    setSiteName: (state, action) => {
      state.siteName = action.payload;
    },
    setStationId: (state, action) => {
      state.stationId = action.payload;
    },
    setStationName: (state, action) => {
      state.stationName = action.payload;
    },
    setChargerId: (state, action) => {
      state.chargerId = action.payload;
    },
    setChargerName: (state, action) => {
      state.chargerName = action.payload;
    },
    setChargeHeadId: (state, action) => {
      state.chargeHeadId = action.payload;
    },
    setChargeHeadName: (state, action) => {
      state.chargeHeadName = action.payload;
    },
    clearAll: (state) => {
      // Reset only the fields specified
      state.siteId = 0;
      state.siteName = "";
      state.stationId = 0;
      state.stationName = "";
      state.chargerId = 0;
      state.chargerName = "";
      state.chargeHeadId = 0;
      state.chargeHeadName = "";
    }
  },
});

export const { 
  setSiteId, 
  setSiteName, 
  setStationId, 
  setStationName, 
  setChargerId, 
  setChargerName, 
  setChargeHeadId, 
  setChargeHeadName, 
  clearAll 
} = evchargerSlice.actions;

export default evchargerSlice.reducer;
