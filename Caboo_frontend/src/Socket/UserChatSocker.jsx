import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUpdateUserChat, adduserMessage } from "../Redux/Chatslice";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import { backendUrl } from '../Utils/Constanse'
import { addToken_data, addUser } from "../Redux/UserSlice";
import { useNavigate } from "react-router-dom";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user_data.user_data);
  const driver = useSelector((state) => state.ride_data.rideDriverdetails);
  const user_id = user ? user[0]?.id : null;
  const driver_id = driver?.data?.user_data?.driver_id;
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [accessToken, setAccessToken] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const navigate = useNavigate()

  const refresh = async () => {
    try {
      console.log("Refreshing token");
      const rawToken = Cookies.get("userTokens");
      const token = JSON.parse(rawToken);
      if (!token.refresh) {
        throw new Error("No refresh token available");
      }
      const response = await axios.post(`${backendUrl}/Api/token/refresh/`, {
        refresh: token.refresh,
      });
      if (response.status === 200) {
        const newToken = response.data;
        console.log(newToken, 'New token received');
        Cookies.set("userTokens", JSON.stringify(newToken), { expires: 7 });
        setAccessToken(newToken.access);
        return newToken.access;
      }
    } catch (error) {
      // console.error("Failed to refresh token", error);
      // dispatch(addUser(null))
      // dispatch(addToken_data(null))
      // Cookies.remove('userTokens')
      toast.warning("Your session has expired. Please log in again to continue.")
      // navigate("/")
      throw error;
    }
  };

  useEffect(()=>{
    const rawtoken = Cookies.get("userTokens")
    let token = null
    if(rawtoken){
        token = JSON.parse(rawtoken)
        setAccessToken(token)
    }  },[])

  const connectWebSocket = useCallback(() => {
    if (!user_id || !driver_id) {
      console.log(user_id)
      console.log(driver_id)
    
      console.log("Missing required data for WebSocket connection");
      setConnectionStatus("disconnected");
      return;
    }else if(!accessToken){
      const rawtoken = Cookies.get("userTokens")
      console.log(rawtoken,'rawtoken')
      let token = null
      if(rawtoken){
          token = JSON.parse(rawtoken)
          setAccessToken(token)
      }else{
        console.log("Token is missing ");
        setConnectionStatus("disconnected");
  
      }
    }

    if (socket) {
      console.log("Closing existing WebSocket connection");
      socket.close();
    }

    const roomId = user_id;
    console.log(`Attempting to connect WebSocket for room ${roomId}`);

    // const ws = new WebSocket(`wss://cabooserver.online/ws/chat/${roomId}/?token=${accessToken}`);
    const ws = new WebSocket(`ws://127.0.0.1:8001/ws/chat/${roomId}/?token=${accessToken}`);
    // const ws = new WebSocket(`wss://backend.caboo.site/ws/chat/${roomId}/?token=${accessToken}`);



    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
      setConnectionStatus("connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      if (data.type.trim() === "chat_message") {
        dispatch(
          adduserMessage([
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
        dispatch(addUpdateUserChat({ id: data.message_id, status: data.status }))
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
      toast.error("Connection error. Please try again later.");
    };

    ws.onclose = async (event) => {
      console.log(`WebSocket connection closed with code ${event.code}`);
      setConnectionStatus("disconnected");
      setSocket(null);

      if (event.code === 4001 || event.code === 1006) {
        console.log("Attempting to refresh token and reconnect");
        try {
          const newToken = await refresh();
          if (newToken) {
            console.log("Token refreshed, reconnecting...");
            // Use setTimeout to prevent immediate reconnection
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 1000);
          } else {
            toast.error("Authentication failed. Please log in again.");
          }
        } catch (error) {
          console.error("Failed to refresh token:", error);
          toast.error("Failed to refresh authentication. Please log in again.");
        }
      } else {
        console.log("Scheduling reconnection attempt");
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
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
  }, [user_id, driver_id, accessToken, dispatch]);

  useEffect(() => {
    const rawtoken = Cookies.get("userTokens");
    if (rawtoken) {
      const token = JSON.parse(rawtoken);
      setAccessToken(token.access);
    }
  }, []);

  useEffect(() => {
    if (accessToken && user_id && driver_id) {
      connectWebSocket();
    }
    return () => {
      if (socket) {
        console.log("Closing WebSocket connection on unmount");
        socket.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [accessToken, user_id, driver_id, connectWebSocket]);

  const handleSendMessage = useCallback((value) => {
    const messageId = Date.now().toString();
    const newSentMessage = {
      id: messageId,
      text: value,
      type: "sent",
      status: "pending",
    };

    dispatch(adduserMessage(newSentMessage));

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({type : 'sendMessge', message: value, connectId: driver_id, messageId })
      );
    } else {
      console.log("WebSocket not open, attempting to reconnect");
      connectWebSocket();
    }
  }, [socket, driver_id, dispatch, connectWebSocket]);

  return (
    <WebSocketContext.Provider value={{ handleSendMessage, connectionStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};