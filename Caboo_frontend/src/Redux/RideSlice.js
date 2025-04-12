import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    distance: null,
    charges: null,
    places: null,
    clintDetails: null,
    driverRideDetails: null,
    rideLocations: null,
    rideDetails: null,
    rideDriverdetails: null,
    otpValidation: null,
    tripid: null,

};

const RideSlice = createSlice({
    name: "Ride_state",
    initialState,
    reducers: {
        addDistance: (state, action) => {
            state.distance = action.payload;
        },
        addCharges: (state, action) => {
            state.charges = action.payload;
        },
        addPlaces: (state, action) => {
            state.places = action.payload;
        },
        addClint: (state, action) => {
            state.clintDetails = action.payload;
        },
        addDriverRide: (state, action) => {
            state.driverRideDetails = action.payload;
        },
        addRideLocations: (state, action) => {
            state.rideLocations = action.payload;
        },
        addRideDetails: (state, action) => {
            state.rideDetails = action.payload;
        },
        addRideDriverdetails: (state, action) => {
            state.rideDriverdetails = action.payload;
        },
        addOTPvalidation: (state, action) => {
            state.otpValidation = action.payload;
        },
        addTripId: (state, action) => {
            state.tripid = action.payload;
        },
        addClearRide: (state) => {
            state.distance = null;
            state.charges = null;
            state.places = null;
            state.clintDetails = null;
            state.driverRideDetails = null;
            state.rideLocations = null;
            state.rideDetails = null;
            state.rideDriverdetails = null;
            state.otpValidation = null;
            state.tripid = null;
        },
        
    }
});

export const {
    addCharges,
    addDistance,
    addPlaces,
    addClint,
    addDriverRide,
    addRideLocations,
    addRideDetails,
    addRideDriverdetails,
    addOTPvalidation,
    addClearRide,
    addTripId,
} = RideSlice.actions;

export default RideSlice.reducer;
