import { createSlice } from "@reduxjs/toolkit";


const DriverSlice=createSlice({
    name:"driver_data",
    initialState:{
        driver_token:null,
        driver_data:null,
        driverTrips:{},
        applyoffer:{}

    },

    reducers:{
        addDriver_token:(state,action)=>{
           
            state.driver_token=action.payload
        },
        addDriver_data:(state,action)=>{
         

            state.driver_data=action.payload
        },
        addDriverTrips:(state,action)=>{
            state.driverTrips=action.payload
        },
        addApplyoffer:(state,action)=>{
             state.applyoffer=action.payload
        },
        addClearDriver:(state,action)=>{
           state.driver_token=null
           state.driver_data=null
           state.driverTrips=null
           state.applyoffer=null


        }
    }
})

export const {addDriver_data,addDriver_token,addDriverTrips,addClearDriver,addApplyoffer}=DriverSlice.actions;

export default DriverSlice.reducer;