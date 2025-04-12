import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar_admin from "./Sidebar_admin";
import Footer from "../Footer";
import Admin_header from "./Admin_header";
import { backendUrl } from "../../Utils/Constanse";

import location from '../../assets/pickup.png'
import time from '../../assets/time.png'
import  pay from '../../assets/pay.png'
import loading from '../../assets/loading.png'
import dropoff from '../../assets/dropoff.png'
import distance from '../../assets/distance.png'
import calendar from '../../assets/calendar.png'
import money from '../../assets/money.png'
import rating_icon from '../../assets/rating.png'
import feedback from '../../assets/feedback.png'
import { FaArrowLeft, FaDownload, FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addCurrentPage } from "../../Redux/AdminSlice";


const TripMore = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { trips } = state || {};
  console.log(state, "state value in trip more page");

  const handlechange=()=>{
    dispatch(addCurrentPage('trip'))
    navigate(-1)
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Admin_header />

      <div className="flex bg-black min-h-screen ">
        <div className="w-1/6 pt-28  ">
        </div>

        <div className="flex-1  w-5/6">
          <div className=" mx-auto  ">
            <div className="bg-white shadow-2xl  mt-24 p-8 rounded-tl-[5rem] ">
              <div className="border-b py-6 mb-6  flex justify-between items-center">
                <h2 className="font-bold text-2xl">Trip Details</h2>
                <div className="text-gray-500 font-medium text-lg space-x-8">
                  <span>Service Type: {trips?.service_type}</span>
                  <span>Trip ID: {trips?.orderId}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center  p-5 rounded-lg bg-gray-50">
                    <img
                      src={`${backendUrl}${trips?.user?.profile}`}
                      alt={trips?.user?.username}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <span className="ml-4 font-bold">
                      User : {trips?.user?.username}
                    </span>
                  </div>

                  <div className="flex items-center  py-4 space-x-3 pl-8 rounded-lg bg-white">
                <img className="h-7" src={rating_icon} alt="review" />

                <div className="text-left">
                  <h2 className="font-bold mb-2">Review</h2>
                  <div className="flex justify-start mb-2">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < trips.rating ? "text-yellow-500" : "text-gray-300"
                        }
                        size={25}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {trips.message && (
                <div className="flex items-center space-x-3 pl-8 rounded-lg bg-white">
                  <img className="h-7" src={feedback} alt="amount" />
                  <span className="font-bold  py-5">
                    Feedback : {trips.message}
                  </span>
                </div>
              )}

                  <div className="flex items-center  space-x-3 pl-8 rounded-lg bg-gray-50">
                  <img className="h-7" src={money} alt="amount" />
                  <span className="py-5 font-bold">
                      Fare: ₹ {trips?.amount}
                    </span>
                  </div>

                  <div className="flex items-center  space-x-3 pl-8 rounded-lg bg-gray-50">
                  <img className="h-7" src={pay} alt="payment" />
                  <span className="py-5 font-bold">
                      Payment Type: {trips?.payment_type}
                    </span>
                  </div>

                  <div className="flex items-center  space-x-3 pl-8 rounded-lg bg-gray-50">
                  <img className="h-7" src={calendar} alt="calendar" />
                  <span className="py-5 font-bold">
                      Date: {trips?.dateTime}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center  p-5 rounded-lg bg-gray-50">
                    <img
                      src={`${backendUrl}${trips?.driver?.profile}`}
                      alt={trips?.driver?.username}
                      className="w-14 h-14 rounded-full object-cover"
                    /> 
                    <span className="py-5 ml-4 font-bold">
                       Driver : {trips?.driver?.username}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center  p-5 rounded-lg bg-gray-50">
                  <img className="h-7" src={loading} alt="status" />
                  <span className="ml-4 font-bold">
                      Status:
                      <span
                        className={`${
                          trips?.status === "completed"
                            ? "text-green-600"
                            : trips?.status === "pending"
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {" "}
                        {trips?.status}
                      </span>
                    </span>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center  p-5 rounded-lg bg-gray-50">
                  <img className="h-7" src={distance} alt="distance" />
                  <span className="ml-4 font-bold">
                      Distance: {trips?.distance} 
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center  p-5 rounded-lg bg-gray-50">
                  <img className="h-7" src={time} alt="duration" />
                  <span className="ml-4 font-bold">
                      Duration: {trips?.duration} 
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center  p-5 rounded-lg bg-gray-50">
                  <img className="h-7" src={location} alt="location" />
                  <span className="ml-4 font-bold">
                      Location: {trips?.location}
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center  p-5 rounded-lg bg-gray-50">
                  <img className="h-7" src={dropoff} alt="destination" />
                  <span className="ml-4 font-bold">
                      Destination: {trips?.destination}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-start mt-8 space-x-4">
                <button
                  onClick={handlechange}
                  className="bg-white border border-gray-700 text-gray-700 font-bold py-2 px-8 rounded-lg flex items-center hover:bg-gray-200 transition"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>
                <button className="bg-black text-white font-bold py-2 px-8 rounded-lg flex items-center hover:bg-gray-700 transition">
                  <FaDownload className="mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TripMore;
