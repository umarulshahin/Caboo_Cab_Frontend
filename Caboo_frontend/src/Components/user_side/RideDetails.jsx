import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import { backendUrl } from "../../Utils/Constanse";
import Footer from "../Footer";
import User_header from "./User_header";
import location from "../../assets/pickup.png";
import time from "../../assets/time.png";
import pay from "../../assets/pay.png";
import loading from "../../assets/loading.png";
import dropoff from "../../assets/dropoff.png";
import distance from "../../assets/distance.png";
import calendar from "../../assets/calendar.png";
import money from "../../assets/money.png";
import rating from "../../assets/rating.png";
import feedback from "../../assets/feedback.png";
import { FaStar } from "react-icons/fa";

const RideDetails = () => {
  const { state } = useLocation();
  console.log(state, "state");
  const { rides } = state || {};
  const navigate = useNavigate();
  console.log(rides);

  if (!rides) {
    return <div>No trip data available.</div>;
  }
  return (
    <div className="min-h-screen flex flex-col font-inter">
      <User_header />

      <div className="flex justify-center items-center py-10 mt-20 bg-gray-200">
        <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl p-8">
          <div className="bg-gray-100 p-1 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-3xl text-gray-800">
                  Trip Details
                </span>
              </div>
              <div className="flex space-x-6">
                <span className="text-gray-600 font-bold">
                  Service Type : {rides.service_type}
                </span>
                <span className="text-gray-600 font-bold">
                  Trip ID : {rides.orderId}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left Column: Driver and Trip Information */}
            <div className="flex flex-col space-y-6">
              {/* Profile Image and Username */}
              <div className="flex items-center space-x-4 p-1 rounded-lg bg-white ">
                <img
                  src={`${backendUrl}${rides.driver.profile}`}
                  alt={rides.driver.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-xl font-semibold">
                  {rides.driver.username}
                </span>
              </div>
              {/* Rating */}
              <div className="flex items-center  p-2 space-x-3  p-1rounded-lg bg-white">
                <img className="h-7" src={rating} alt="review" />

                <div className="text-left">
                  <h2 className="font-bold mb-2">Review</h2>
                  <div className="flex justify-start mb-2">
                    {/* Render stars based on dynamic rating */}
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < rides.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                        size={25}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {rides.message && (
                <div className="flex items-center  space-x-3 p-2 rounded-lg bg-white">
                  <img className="h-7" src={feedback} alt="amount" />
                  <span className="font-bold ">
                    Feedback : {rides.message}
                  </span>
                </div>
              )}

              {/* Fare */}
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-white ">
                <img className="h-7" src={money} alt="amount" />
                <span className="text-lg font-bold">Fare: ₹{rides.amount}</span>
              </div>
              {/* Payment Type */}
              <div className="flex items-center space-x-3  p-2 rounded-lg bg-white ">
                <img className="h-7" src={pay} alt="paytype" />
                <span className="text-lg font-bold">
                  Paid Type: {rides.payment_type}
                </span>
              </div>
              {/* Date */}
              <div className="flex items-center space-x-3  p-2 rounded-lg bg-white ">
                <img className="h-7" src={calendar} alt="date" />
                <span className="text-lg font-bold">
                  Date: {rides.dateTime}
                </span>
              </div>
            </div>

            {/* Right Column: Trip Details */}
            <div className="flex flex-col space-y-6">
              {/* Status */}
              <div className="flex items-center space-x-4 p-1 rounded-lg bg-white ">
                <img className="h-7" src={loading} alt="status" />
                <span className="text-lg font-bold">
                  Status:{" "}
                  <span
                    className={`${
                      rides.status === "completed"
                        ? "text-green-600"
                        : rides.status === "pending"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {" "}
                    {rides.status}
                  </span>
                </span>
              </div>
              {/* Distance */}
              <div className="flex items-center space-x-4 p-1 rounded-lg bg-white ">
                <img className="h-7" src={distance} alt="distance" />
                <span className="text-lg font-bold">
                  Distance: {rides.distance}
                </span>
              </div>
              {/* Duration */}
              <div className="flex items-center space-x-4 p-1 rounded-lg bg-white ">
                <img className="h-7" src={time} alt="duration" />
                <span className="text-lg font-bold">
                  Duration: {rides.duration}
                </span>
              </div>
              {/* Location */}
              <div className="flex items-center space-x-4 p-1 rounded-lg bg-white ">
                <img className="h-7" src={location} alt="pickup" />
                <span className="text-lg font-bold">
                  Location: <br />
                  <span>{rides.location}</span>
                </span>
              </div>
              {/* Destination */}
              <div className="flex items-center space-x-4 p-1 rounded-lg bg-white ">
                <img className="h-7" src={dropoff} alt="dropoff" />
                <span className="text-lg font-bold">
                  Destination: <br />
                  <span>{rides.destination}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end mt-8 space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-transparent border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:border-black flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <button className="bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center">
              <FaDownload className="mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RideDetails;
