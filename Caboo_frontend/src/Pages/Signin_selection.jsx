import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Modal from '../Components/Authentication/Modal';
import Signin_form from '../Components/Authentication/Signin_form';
import OtpForm from '../Components/Authentication/OtpFrom';
import { addrole } from '../Redux/AuthenticationSlice';
import Driver_Otp from '../Components/Authentication/Driver_Otp';

const Signin_selection = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const { state } = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (state?.modal) {
      openModal(state.modal);
    }
  }, [state]);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  const headprops = {
    ride: false,
    drive: false,
    user: false,
  };

     
  const handleOption = (content) => {
    dispatch(addrole(content));
    openModal(content);
  };

  return (
    <div>
      <div>
        <Header headprops={headprops} />
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent === 'Ride' && <Signin_form />}
        {modalContent === 'OTP verify' && <OtpForm />}
        {modalContent === 'OTP Driver' && <Driver_Otp />}
        {modalContent === 'Drive' && <Signin_form />}
      </Modal>
      {state?.signin ? (
        <div className="h-screen bg-black text-white space-x-80 flex justify-center items-center font-medium text-xl underline">
          <button
            onClick={() => handleOption('Ride')}
            className="relative flex items-center gap-1 py-4 px-9 border-4 border-transparent text-lg bg-inherit rounded-full font-semibold text-white shadow-[0_0_0_2px] shadow-white cursor-pointer overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_0_0_12px_transparent] hover:text-gray-900 active:scale-95 group"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="absolute w-6 fill-white z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] -left-6 group-hover:left-4" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
            <span className="relative z-10 transform -translate-x-3 transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-3 no-underline"> 
              Sign in to Ride
            </span>
            <span 
              className="absolute top-1/2 left-1/2 w-5 h-5 bg-white rounded-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] transform -translate-x-1/2 -translate-y-1/2 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100"
            ></span>
            <svg 
              viewBox="0 0 24 24" 
              className="absolute w-6 fill-white z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] right-4 group-hover:-right-6" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
          </button>

          <button
            onClick={() => handleOption('Drive')}
            className="relative flex items-center gap-1 py-4 px-9 border-4 border-transparent text-lg bg-inherit rounded-full font-semibold text-white shadow-[0_0_0_2px] shadow-white cursor-pointer overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_0_0_12px_transparent] hover:text-gray-900 active:scale-95 group"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="absolute w-6 fill-white z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] -left-6 group-hover:left-4" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
            <span className="relative z-10 transform -translate-x-3 transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-3 no-underline"> 
              Sign in to Drive
            </span>
            <span 
              className="absolute top-1/2 left-1/2 w-5 h-5 bg-white rounded-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] transform -translate-x-1/2 -translate-y-1/2 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100"
            ></span>
            <svg 
              viewBox="0 0 24 24" 
              className="absolute w-6 fill-white z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] right-4 group-hover:-right-6" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
          </button>
        </div>
      ) : (
        <div className="h-screen bg-black text-white space-x-80 flex justify-center items-center font-medium text-xl underline">
          <button
            onClick={() => handleOption('Ride')}
            className="relative flex items-center gap-1 py-4 px-9 border-4 border-transparent text-lg bg-inherit rounded-full font-semibold text-white shadow-[0_0_0_2px] shadow-white cursor-pointer overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_0_0_12px_transparent] hover:text-gray-900 active:scale-95 group"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="absolute w-6 fill-white z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] -left-6 group-hover:left-4" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
            <span className="relative z-10 transform -translate-x-3 transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-3 no-underline"> 
              Sign up to Ride
            </span>
            <span 
              className="absolute top-1/2 left-1/2 w-5 h-5 bg-white rounded-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] transform -translate-x-1/2 -translate-y-1/2 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100"
            ></span>
            <svg 
              viewBox="0 0 24 24" 
              className="absolute w-6 fill-white z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] right-4 group-hover:-right-6" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
          </button>

          <button
            onClick={() => handleOption('Drive')}
            className="relative flex items-center gap-1 py-4 px-9 border-4 border-transparent text-lg bg-inherit rounded-full font-semibold text-white shadow-[0_0_0_2px] shadow-white cursor-pointer overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_0_0_12px_transparent] hover:text-gray-900 active:scale-95 group"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="absolute w-6 fill-white z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] -left-6 group-hover:left-4" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
            <span className="relative z-10 transform -translate-x-3 transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-3 no-underline"> 
              Sign up to Drive
            </span>
            <span 
              className="absolute top-1/2 left-1/2 w-5 h-5 bg-white rounded-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] transform -translate-x-1/2 -translate-y-1/2 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100"
            ></span>
            <svg 
              viewBox="0 0 24 24" 
              className="absolute w-6 fill-white z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] right-4 group-hover:-right-6" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
          </button>
        </div>
      )}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Signin_selection;
