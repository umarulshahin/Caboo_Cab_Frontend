import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adddriverMessage, addUpdateDriverChat, adduserMessage } from '../Redux/Chatslice';
import { toast } from 'sonner';
import Cookies from "js-cookie"
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../Utils/Constanse';


const DriverWebSocketContext = createContext({
  handleSendDriverMessage: () => {}, // Default function
});

export const DriverWebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver_data.driver_data);
  const user = useSelector((state) => state.driver_ride_data.driverrideDetails);
  const messages = useSelector((state) => state.chat_data.driverMessage)
  const [accessToken , setAccessToken] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const reconnectTimeoutRef = useRef(null);
  const navigate = useNavigate()



  const refresh = async () => {
    try {
      const rawToken = Cookies.get("DriverTokens")
      const token = JSON.parse(rawToken);
      if (!token.refresh) {
        throw new Error("No refresh token available");
      }
      const response = await axios.post(`${backendUrl}/Api/token/refresh/`, {
        refresh: token.refresh,
      });
      if (response.status === 200) {
        const newToken = response.data;
        Cookies.set("userTokens", JSON.stringify(newToken), { expires: 7 });
        setAccessToken(newToken.access);
        return newToken.access;
      }
    } catch (error) {
      // console.error("Failed to refresh token", error);
      // dispatch(addDriver_data(null))
      // dispatch(addDriver_token(null))
      // Cookies.remove('DriverTokens')
      // navigate("/")
      toast.warning("Your session has expired. Please log in again to continue.")
      
      throw error;
    }
  };
  
  useEffect(()=>{
    const rawtoken = Cookies.get("DriverTokens")
    let token = null
    if (rawtoken){
       token= JSON.parse(rawtoken)
       setAccessToken(token)
  
    }
  },[])


  const [driverSocket, setDriverSocket] = useState(null);
  const user_id = user?.userRequest?.user_id || null;
  const driver_id = driver ? driver[0]?.customuser?.id : null;

  const connectDriverWebSocket = useCallback(() =>{
    
    if (!user_id || !driver_id || !accessToken){
      console.log("Missing required data for WebSocket connection");
      setConnectionStatus("disconnected");
    } 

    const roomId = driver_id;
    // const ws = new WebSocket(`wss://cabooserver.online/ws/chat/${roomId}/?token=${accessToken}`);
    const ws = new WebSocket(`ws://127.0.0.1:8001/ws/chat/${roomId}/?token=${accessToken}`);

        // const ws = new WebSocket(`wss://backend.caboo.site/ws/chat/${roomId}/?token=${accessToken}`);




    ws.onopen = () => {
      console.log('Driver WebSocket connection established');
      setDriverSocket(ws);
      setConnectionStatus("connected");

    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type.trim() === "chat_message") {

        dispatch(
          adddriverMessage([
            {
              id: data.message_id,
              text: data.message,
              type: "received",
              status: "delivered",
            },
          ])
        );
        toast.info("You have received a new message");

        ws.send(JSON.stringify({
          type:'received',
          user_id : data.user_id,
          message : data.message,
          message_id : data.message_id
        }))
      } else if (data.type.trim() === "delivery_status") {
        dispatch(addUpdateDriverChat({ id: data.message_id, status: data.status }))
      }
    };

    ws.onerror = (error) => {
      console.error('Driver WebSocket error:', error);
      setConnectionStatus("error");
      toast.error("Connection error. Please try again later.");
    };

    ws.onclose = async (event) => {
      setConnectionStatus("disconnected");
      setDriverSocket(null);

      if (event.code === 4001 || event.code === 1006) {
        console.error("Attempting to refresh token and reconnect");
        try {
          const newToken = await refresh();
          if (newToken) {
            console.log("Token refreshed, reconnecting...");
            // Use setTimeout to prevent immediate reconnection
            reconnectTimeoutRef.current = setTimeout(connectDriverWebSocket, 1000);
          } else {
            toast.error("Authentication failed. Please log in again.");
          }
        } catch (error) {
          console.error("Failed to refresh token:", error);
          toast.error("Failed to refresh authentication. Please log in again.");
        }
      } else {
        console.log("Scheduling reconnection attempt");
        reconnectTimeoutRef.current = setTimeout(connectDriverWebSocket, 5000);
      }
    };

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [driver_id, user_id,accessToken, dispatch]);

  useEffect(() => {
    const rawtoken = Cookies.get("DriverTokens");
    if (rawtoken) {
      const token = JSON.parse(rawtoken);
      setAccessToken(token.access);
    }
  }, []);

  useEffect(() => {
    if (accessToken && user_id && driver_id) {
      connectDriverWebSocket();
    }
    return () => {
      if (driverSocket) {
        console.log("Closing WebSocket connection on unmount");
        driverSocket.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [accessToken, user_id, driver_id, connectDriverWebSocket]);
  

  const handleSendDriverMessage = useCallback((value) => {

    const messageId = Date.now().toString();
    const newSentMessage = {
      id: messageId,
      text: value,
      type: "sent",
      status: "pending",
    };
    dispatch(adddriverMessage(newSentMessage))

    if (value && driverSocket && driverSocket.readyState === WebSocket.OPEN) {

  
      driverSocket.send(JSON.stringify({ type : 'sendMessge', message: value, connectId: user_id ,messageId}));
    }else{
      console.error("WebSocket not open, attempting to reconnect");
      connectDriverWebSocket();    }

  },[driverSocket,user_id,dispatch, connectDriverWebSocket]);

  return (
    <DriverWebSocketContext.Provider value={{ handleSendDriverMessage,connectionStatus }}>
      {children}
    </DriverWebSocketContext.Provider>
  );
};

export const useDriverWebSocket = () => useContext(DriverWebSocketContext);
