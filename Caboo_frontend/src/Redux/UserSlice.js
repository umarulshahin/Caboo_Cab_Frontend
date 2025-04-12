import { createSlice } from "@reduxjs/toolkit";



const userSlice=createSlice({
    name:"user_data",
    initialState:{
        user_data:{},
        token_data:{},
        userTrips:{},
        walletdetails:{},
        userCoupons:{}
    },
    reducers:{
        addUser:(state,action)=>{
    
           state.user_data=action.payload
        },
        addToken_data:(state,action)=>{
         
            state.token_data=action.payload
        },
        addUserTrips:(state,action)=>{
            state.userTrips=action.payload
        },
        addWalletDetails:(state,action)=>{
            state.walletdetails=action.payload
        },
        addUserCoupons:(state,action)=>{
           state.userCoupons=action.payload
        },
        addClearUser:(state,action)=>{
            state.user_data=null
            state.token_data=null
            state.userTrips = null
            state.walletdetails=null
            state.userCoupons=null
        }
    }

})
export const {addUser,addToken_data,addUserTrips,addWalletDetails,addClearUser,addUserCoupons}=userSlice.actions

export default userSlice.reducer;
