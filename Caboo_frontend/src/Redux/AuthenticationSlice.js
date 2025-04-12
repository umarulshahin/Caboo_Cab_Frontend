import { createSlice } from "@reduxjs/toolkit";

const AuthenticationSlice = createSlice({
  name: "signup_data",
  initialState: {
    email:'',
    user_status:'',
    role:'',
    driver_status:'',

  },
  reducers: {
  
    addemail:(state,action)=>{

      state.email=action.payload
    },
    addUser_status:(state,action)=>{
      state.user_status=action.payload
    },
    addrole:(state,action)=>{
      state.role=action.payload
    },
    addDriver_status:(state,action)=>{
      state.driver_status=action.payload
    }
  },
});

export const { addemail,addUser_status,addrole,addDriver_status } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
