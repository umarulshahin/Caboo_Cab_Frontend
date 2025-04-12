import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import userReducer from "./UserSlice"
import AdminReducer from "./AdminSlice";
import DriverReducer from "./DriverSlice";
import AuthenticationReducer from "./AuthenticationSlice";
import RideReducer from "./RideSlice";
import DriverRideReducer from "./DriverRideSlice";
import ChatReducer from "./Chatslice";

const persistConfig ={
    key:'root',
    version:1,
    storage,
}

const rootReducer = combineReducers({
    Authentication:AuthenticationReducer,
    user_data:userReducer,
    admin_data:AdminReducer,
    driver_data:DriverReducer,
    ride_data:RideReducer,
    driver_ride_data:DriverRideReducer,
    chat_data:ChatReducer,
})

const PersistedReducer = persistReducer(persistConfig,rootReducer)


const appStore = configureStore({
    reducer: PersistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
  });

const persist=persistStore(appStore)

export {persist,appStore}