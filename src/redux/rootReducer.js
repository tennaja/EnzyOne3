const { combineReducers } = require("@reduxjs/toolkit");

import appConfigSlice from "./slicer/appConfigSlice";
import companySlice from "./slicer/companySlice";
import loadingSlice from "./slicer/loadingSlice";
import userSlice from "./slicer/userSlice";
import variableSlice from "./slicer/variableSlice";
import smartstreetlightSlice from "./slicer/smartstreetlightSlice";

const rootReducer = combineReducers({
  userData: userSlice,
  companyData: companySlice,
  isLoading: loadingSlice,
  variableData: variableSlice,
  appConfig: appConfigSlice,
  smartstreetlightData: smartstreetlightSlice,
});

export default rootReducer;
