import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useDriverWebSocket } from '../../Socket/DriverChatSocket';

const Driver_chat = ({ setShowchat }) => {
  const driverMessage = useSelector((state) => state.chat_data.driverMessage);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const { handleSendDriverMessage } = useDriverWebSocket();

  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [driverMessage, shouldAutoScroll]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        setShouldAutoScroll(scrollHeight - scrollTop === clientHeight);
      };
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      handleSendDriverMessage(newMessage);
      setNewMessage('');
      setShouldAutoScroll(true);
    }
  };

  const handleBack = () => {
    setShowchat(false);
  };

  return (
    <div className=" flex flex-col h-screen  mx-auto bg-[url('https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-bg-dark-background-thumbnail.jpg')] p-4 rounded-md">
      <div 
        ref={messagesContainerRef}
        className="chat_ui flex-1 overflow-y-auto mb-4 max-h-[calc(100vh-100px)]"
      >
        {Array.isArray(driverMessage) && driverMessage.length > 0 ? (
          driverMessage.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "sent" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              {msg.status ? (
                msg.status === "pending" ? (
                  <div className="flex flex-col">
                    <div
                      className={`py-2 rounded-lg max-w-xs flex items-center  ${
                        msg.type === "sent"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mx-2 text-start text-red-300 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.993.883L9 8v4a1 1 0 001.993.117L11 12V8a1 1 0 00-1-1zm0 8a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {typeof msg.text === "string"
                        ? msg.text
                        : JSON.stringify(msg.text)}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500">
                        Message not send
                      </p>
                    </div>
                  </div>
                ) : msg.status === "delivered" ? (
                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.type === "sent"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {typeof msg.text === "string"
                      ? msg.text
                      : JSON.stringify(msg.text)}
                  </div>
                ) : null
              ) : (
                <p>No messages</p>
              )}
            </div>
          ))
        ) : null }
      </div>

      {/* Message Input */}
      <div className="flex items-center space-x-4 p-4">
        <button
          onClick={handleBack}
          className="bg-transparent border text-white font-semibold py-2 px-4 rounded-lg hover:border-white flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <form onSubmit={handleMessage} className="flex flex-1">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Driver_chat;