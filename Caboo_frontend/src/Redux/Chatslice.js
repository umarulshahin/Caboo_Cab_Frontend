import { createSlice } from "@reduxjs/toolkit";


const Chatslice=createSlice({
    name:'Chat',
    initialState:{
        userMessage:[],
        driverMessage:[],
      

    },
    reducers:{
        adduserMessage:(state,action)=>{
            const exists = state.userMessage.some(message => message.id === action.payload.id);
            if (!exists) {
                state.userMessage = state.userMessage.concat(action.payload);
            }        },
        adddriverMessage:(state,action)=>{
            state.driverMessage=state.driverMessage.concat(action.payload)
        },
        addClearChat:(state,action)=>{
            state.userMessage=[]
            state.driverMessage=[]
        },
        addUpdateUserChat:(state,action)=>{
            const {id,status}= action.payload

            const message = state.userMessage.find((message)=>message.id === id)
            console.log(message, 'update message user')
            if(message){
                message.status = status
            }
        },
        addUpdateDriverChat:(state,action)=>{
            const {id,status}= action.payload

            const message = state.driverMessage.find((message)=>message.id === id)
            console.log(message, 'update message driver')
            if(message){
                message.status = status
            }
        }
    
    }
})

export const {adddriverMessage,adduserMessage,addClearChat,addUpdateUserChat,addUpdateDriverChat}=Chatslice.actions

export default Chatslice.reducer