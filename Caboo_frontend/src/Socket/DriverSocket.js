import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import notificationSound from '../assets/notification.wav';
import { useLoadScript } from "@react-google-maps/api";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {addDriver_driverRide, addDriverClearRide, addDriverOTPvalidation, addDriverRideDetails, addDriverRideLocations, addDriverTripId,} from '../Redux/DriverRideSlice';
import { addClearChat } from '../Redux/Chatslice';
import Cookies from "js-cookie"
import { addApplyoffer, addClearDriver } from '../Redux/DriverSlice';
import DriverLocation from './DriverLocation';

const libraries = ["places"];
const apiKey = import.meta.env.VITE_google_map_api_key;

const useDriverWebSocket = () => {
    const [isRequestInProgress, setIsRequestInProgress] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalUserData, setModalUserData] = useState(null);
    const [responded, setResponded] = useState(false);
    const driver = useSelector((state) => state.driver_data.driver_token);
    const driverdetails = useSelector((state) => state.driver_data.driver_data);
    const tripId = useSelector((state)=>state.driver_ride_data.drivertripid)
    const applyoffer = useSelector((state)=>state.driver_data.applyoffer)
    const {handleDriverLocation} =DriverLocation()
    const [declineTimeout, setDeclineTimeout] = useState(null);
    const socketRef = useRef(null);
    const respondedRef = useRef(false);
    const [Driverlocation,setDriverlocation] = useState(null)
    const dispatch=useDispatch()
    const navigate = useNavigate()
    const rawtoken = Cookies.get("DriverTokens")
    let token = null 
    if (rawtoken){
        token= JSON.parse(rawtoken)
        console.log(token["access"],'driver token')
        
    }


    useEffect(() => {
        respondedRef.current = responded;
    }, [responded]);

    useEffect(() => {
        if (!driver || !driver.user_id || !token) {
            // dispatch(addClearDriver(null))
            // Cookies.remove("DriverTokens")
            // toast.warning("Something went wrong. Please log in again.")
            // navigate("/")
            return
        }
        // const ws = new WebSocket(`wss://cabooserver.online/ws/driverlocation/${driver.user_id}/?token=${token["access"]}`);
        const ws = new WebSocket(`ws://127.0.0.1:8001/ws/driverlocation/${driver.user_id}/?token=${token["access"]}`);
        // const ws = new WebSocket(`wss://backend.caboo.site/ws/driverlocation/${driver.user_id}/?token=${token["access"]}`);


        socketRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        const handleDecline = (user_data) => {
            console.log('No, ride declined 1');
            clearTimeout(declineTimeout);
            setResponded(true);
            respondedRef.current = true;
            setShowModal(false);
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    requestType: 'rideRequestResponse',
                    driver_id: driver.user_id,
                    user_data:user_data,
                    rideRequestResponse: 'declined',
                }));
            } else {
                console.error('WebSocket is not open. Unable to send decline message.');
            }
            clearTimeout(declineTimeout);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data,'yes driver side request reached ')
            
            if (data.type === "'pending ride'"){
               console.log('yes pending ride is working ',data)

            }else if (data.type === "block notification" ){
                // dispatch(addClearDriver(null))
                // Cookies.remove("DriverTokens")
                toast.warning("Your account has been blocked. Please contact our customer service.")
                // navigate("/")
            }else if (data.type === 'location_request') {

                if (!isRequestInProgress) {
                    setIsRequestInProgress(true);
                    handleLocationRequest(ws,data.user_id);
                }
            } else if (data.type === 'Riding_request') {
                console.log("Ride request received");
                console.log(data.user_data, 'user data');

                setModalUserData(data.user_data);
                setShowModal(true);
                setResponded(false);
                respondedRef.current = false;

                const audio = new Audio(notificationSound);
                audio.play().catch((error) => {
                    console.warn("Audio play was blocked:", error);
                });

                const timeout = setTimeout(() => {
                    if (!respondedRef.current) {
                        console.warn("No action taken, automatically declining the request.");
                        handleDecline(data.user_data);
                    }
                }, 10000);

                setDeclineTimeout(timeout);

            }else if(data.type.trim() === "otp validation faild"){
                console.log('yes working')
                toast.error('OTP invalid try again .')

            }else if (data.type.trim() === 'OTP_success'){
                console.log('yes otp validation is working')
                
                dispatch(addDriverOTPvalidation('OTP_success'))
                console.log('after otp ')

            }else if (data.type === 'Payment verification'){
                console.log(data.message.userRequest,'user request')
                if(data.message.userRequest.offer ){
                    console.log("yes verification is working")

                   dispatch(addApplyoffer(data.message.userRequest.offer))
                }
                navigate('/paymentconfirm')
                ws.close()
                
            }else if (data.type.trim() === "Trip cancel"){

                dispatch(addDriverClearRide(null))
                dispatch(addClearChat(null))

                navigate('/driver_home')
                toast.warning("User canceled the trip. We apologize for the inconvenience.")

            }else if (data.type.trim() === "ride_accepted"){
                console.log('ride acceptence')
                dispatch(addDriverTripId(data.data['trip_id']))
            }else if (data.type.trim() === 'payment completed'){
                dispatch(addDriverClearRide(null))
                navigate('/driver_home')
                toast.success('The ride has been successfully completed.')
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN ) {
                ws.close();
            }
            clearTimeout(declineTimeout);
        };
    }, [driver,token]);
 
  
        
    const handleLocationRequest = (ws,user_id) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
                    setDriverlocation({lat:latitude,lng:longitude})
                    ws.send(JSON.stringify({
                        requestType: 'sendLocation',
                        Driverlocation: { latitude, longitude },
                        id: driver.user_id,
                        user_id : user_id
                    }));
                    setIsRequestInProgress(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsRequestInProgress(false);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setIsRequestInProgress(false);
        }
    };

     
    
    const handleAcceptRide = async () => {
        
        console.log('Yes, ride accepted');
        setResponded(true);
        respondedRef.current = true;
        setShowModal(false);
        if (declineTimeout) {
            clearTimeout(declineTimeout);
            setDeclineTimeout(null); 
            console.log("yes it's working clear time out")
        }
    
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && Driverlocation && modalUserData?.userRequest?.place_code?.location) {
            try {
                const driverData = await handleDriverLocation(Driverlocation, modalUserData.userRequest.place_code.location);
                console.log(driverData,'driver data')
                
                

                const ridedata={
                    client:{lat:driverData.clientLocation.lat,
                            lng:driverData.clientLocation.lng},
                    driver:{lat:driverData.driverLocation.lat,
                            lng:driverData.driverLocation.lng },
                }
            
                dispatch(addDriverRideLocations(ridedata))
                dispatch(addDriver_driverRide(driverData))
                dispatch(addDriverRideDetails(modalUserData))
                // Send response message with WebSocket
                socketRef.current.send(JSON.stringify({
                    requestType: 'rideRequestResponse',
                    driver_id: driver.user_id,
                    rideRequestResponse: 'accepted',
                    driverdata: driverData,
                    driverDtails : driverdetails,
                    ride_data : modalUserData
                }));

                navigate('/ride')
               
            } catch (error) {
                console.error('Error handling driver location:', error);
            }
        } else {
            console.error('WebSocket is not open or location data is missing.');
        }

    };
    

    const OTP_confirm= async(value)=>{
           console.log("yes otp fucntion working")
           if(value){
            const data={
                'otp' : value,
                'driver_id' : driver.user_id
            }
             socketRef.current.send(JSON.stringify({
                requestType: 'otp_confirm',
                Otp_data : data,
                trip_id:tripId
    
               }))
           }      
           dispatch(addClearChat())   
    }

    const Ride_completion=()=>{
        socketRef.current.send(JSON.stringify({
            requestType: 'ride complete',
            ride_complete: 'success',
            trip_id:tripId,
            applyoffer:applyoffer
        }))
    }

    const Paymentconfirm=()=>{

        

        socketRef.current.send(JSON.stringify({
            requestType : "payment received ",
            'payment received' : 'cashinhand',
            trip_id:tripId,
            applyoffer:applyoffer

        }))
        dispatch(addDriverClearRide(null))
        navigate('/driver_home')
        
    }
    
    const RideCancel=()=>{
       
        dispatch(addDriverClearRide(null))
        dispatch(addClearChat(null))
        
        console.log(tripId,'trip id ')
       console.log(typeof(tripId),'tripid type')
        socketRef.current.send(JSON.stringify({
            'drivertripcancel' : 'Driver want cancel this ride',
            trip_id:tripId
        }))

        navigate('/driver_home')
    }
    return {
        showModal,
        modalUserData,
        handleAcceptRide,
        OTP_confirm,
        Ride_completion,
        Paymentconfirm,
        RideCancel,

        handleDecline: () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                console.log('No, ride declined 2');
                setResponded(true);
                respondedRef.current = true;
                setShowModal(false);
                socketRef.current.send(JSON.stringify({
                    requestType: 'rideRequestResponse',
                    driver_id: driver.user_id,
                    user_data: modalUserData,
                    rideRequestResponse: 'declined',
                }));

                clearTimeout(declineTimeout);
            } else {
                console.error('WebSocket is not open. Unable to send decline message.');
            }
        },

    };
};

export default useDriverWebSocket;