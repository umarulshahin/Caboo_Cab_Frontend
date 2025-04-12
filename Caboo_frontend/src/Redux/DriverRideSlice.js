import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  
    
    driverclintDetails:null,
    driver_driverRideDetails: null,
    driverrideLocations: null,
    driverrideDetails: null,
    driverrideDriverdetails: null,
    driverotpValidation: null,
    drivertripid: null,
};
const DriverRideSlice = createSlice({
    name:'driver_ride_slice',
    initialState,
    reducers:{
        addDriverClint: (state, action) => {
            state.driverclintDetails = action.payload;
        },
        addDriver_driverRide: (state, action) => {
            console.log(state.driver_driverRideDetails,"driver ride data  current ")
            console.log(action.payload,'driver ride data aciton')
            state.driver_driverRideDetails = action.payload;
        },
        addDriverRideLocations: (state, action) => {
            console.log(state.driverrideLocations,"driver ride location current ")
            console.log(action.payload,'driver ridelocation aciton')
            state.driverrideLocations = action.payload;
        },
        addDriverRideDetails: (state, action) => {
            console.log(state.driverrideDetails,"driver ride details current")
            console.log(action.payload,'driver ride details aciton')
            state.driverrideDetails = action.payload;
        },
        addDriverRideDriverdetails: (state, action) => {
            state.driverrideDriverdetails = action.payload;
        },
        addDriverOTPvalidation: (state, action) => {
            console.log('yes otp verification is working');
            state.driverotpValidation = action.payload;
        },
        addDriverTripId: (state, action) => {
            state.drivertripid = action.payload;
        },
        addDriverClearRide: (state) => {
            console.log('yes it is working');
            state.driverclintDetails = null;
            state.driverrideLocations = null;
            state.driverrideDetails = null;
            state.driverrideDriverdetails = null;
            state.driverotpValidation = null;
            state.drivertripid = null;
            state.driver_driverRideDetails = null;
        }
    }
})

export const {
    addDriverClint,
    addDriver_driverRide,
    addDriverRideLocations,
    addDriverRideDetails,
    addDriverRideDriverdetails,
    addDriverOTPvalidation,
    addDriverTripId,
    addDriverClearRide

}=DriverRideSlice.actions

export default DriverRideSlice.reducer

