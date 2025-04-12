import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  addClearRide, addOTPvalidation, addRideDriverdetails, addTripId } from '../Redux/RideSlice';
import { json, useNavigate } from 'react-router-dom';
import { replace } from 'formik';
import { toast } from 'sonner';
import useGetUser from '../Hooks/useGetUser';
import { user_data_url } from '../Utils/Constanse';
import { addClearChat } from '../Redux/Chatslice';
import Cookies from "js-cookie"
import { addClearUser, addUserCoupons } from '../Redux/UserSlice';
import { backendUrl } from '../Utils/Constanse';

const useUserWebSocket = () => {
    const [socket, setSocket] = useState(null);
    const user = useSelector((state) => state.user_data.token_data);
    const trip_id = useSelector((state)=>state.ride_data.tripid)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {Get_data}=useGetUser()
    const rawtoken = Cookies.get("userTokens")

    let token = null

    useEffect(()=>{
        token = JSON.parse(rawtoken)
        console.log(token.access,'user token')
    },[rawtoken])
        
    
   

    useEffect(() => {
        if ( !user || !user.user_id ) {
            console.error("User ID is not available");
            return;
        }

        if (!user.user_id || !token )return ;

        // const ws = new WebSocket(`wss://cabooserver.online/ws/driverlocation/${user.user_id}/?token=${token["access"]}`);
        const ws = new WebSocket(`ws://127.0.0.1:8001/ws/driverlocation/${user.user_id}/?token=${token["access"]}`);
        // const ws = new WebSocket(`wss://backend.caboo.site/ws/driverlocation/${user.user_id}/?token=${token["access"]}`);



        console.log(ws);
        
        ws.onopen = () => {
            console.log('WebSocket connection established');
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message received:', data);
            
            if (data.type === "block notification" ){
                // dispatch(addClearUser(null))
                // Cookies.remove('userTokens')
                // localStorage.removeItem('status')
                toast.warning("Your account has been blocked. Please contact our customer service.")
                // navigate("/")
            }else if (data.type==='ride_accepted'){
               
                dispatch(addRideDriverdetails(data))
                console.log(data.data.trip_id,"accept data")

                dispatch(addTripId(data.data.trip_id))
                navigate('/userRide')

            }else if (data.type.trim() === 'OTP_success'){

                console.log('yes otp success working asdfasdfsad')
                dispatch(addOTPvalidation('OTP_success'))
                dispatch(addClearChat([]))
                navigate('/userRide')

            }else if (data.type.trim() === 'Trip complete'){
                console.log(data.message,"yes payment is working ")
                dispatch(addUserCoupons(data.message))
                navigate('/paymentModal')

            }else if (data.type.trim() === "payment completed"){
                const trip=trip_id
                dispatch(addClearRide(null))
                Get_data(user_data_url)
                navigate('/confirmation',{state:{trip_id:trip}});   
                             
            }else if (data.type.trim() === 'Trip cancel'){
                dispatch(addClearRide(null))
                dispatch(addClearChat(null))
                navigate('/userhome', { replace: true });

                toast.warning("Driver canceled the trip. We apologize for the inconvenience.")

            }else if (data.type.trim() === 'User already in a ride'){
                toast.warning("Please complete your current ride before trying again.")
                navigate('/userRide')
            }else if (data.type.trim() === 'User is already active as a driver'){
                console.log('yes its working ')
                toast.warning("The user is already active as a driver. Please change the driver status first.")
                navigate('/userRide')
            }

        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = (event) => {
            console.log(event.code,'WebSocket connection closed');
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [user]);

    const sendMessage = (data) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            data['trip_id']=trip_id
            console.log('Sending message:',data);

            socket.send(JSON.stringify({ userRequest: data }));
        } else {
            console.error('Cannot send message, WebSocket is not open');
        }
    };

    const Canceltrip=()=>{
         console.log('cancel socket is working')
         if (socket && socket.readyState === WebSocket.OPEN) {

            dispatch(addClearRide(null))
            dispatch(addClearChat(null))

            console.log(trip_id,'Sending message:');
            const data={
                'usertripcancel': 'user want cancel this trip',
                'trip_id' :trip_id
            }
            socket.send(JSON.stringify({ usertripcancel: data }));
            navigate('/userhome', { replace: true });
            
        } else {
            console.error('Cannot send message, WebSocket is not open');
        }
    }


    const OnlinePay = async(value)=>{
           
        console.log(value,'value coming online pay')
        if (socket && socket.readyState === WebSocket.OPEN) {
  
            socket.send(JSON.stringify({paymentdetails:value}));
        }else {
            console.error('Cannot send message, WebSocket is not open');
        }
    }

    return { sendMessage, Canceltrip,OnlinePay };
};

export default useUserWebSocket;
