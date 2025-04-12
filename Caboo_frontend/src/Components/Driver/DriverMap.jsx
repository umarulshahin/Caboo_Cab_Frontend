import { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Polyline,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import useDriverWebSocket from "../../Socket/DriverSocket";

import destination_icon from "../../assets/destination.png";
import location_icon from "../../assets/location.png";
import key from "../../assets/key.png";
import pickup from "../../assets/pickup.png";
import dropoff from "../../assets/dropoff.png";
import money from "../../assets/money.png";
import time from "../../assets/time.png";
import distancee from "../../assets/distance.png";
import Ride_finish_modal from "./Ride_finish_modal";
import DriverRideCancel from "./DriverRideCancel";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import Driver_chat from "./Driver_chat";

const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const pickupIcon = {
  url: location_icon,
  scaledSize: { width: 30, height: 30 },
};

const destinationIcon = {
  url: destination_icon,
  scaledSize: { width: 30, height: 30 },
};

const apiKey = import.meta.env.VITE_google_map_api_key;

const DriverMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const data = useSelector(
    (state) => state.driver_ride_data.driverrideLocations
  );
  const ridedetails = useSelector(
    (state) => state.driver_ride_data.driverrideDetails
  );
  const otpvalidation = useSelector(
    (state) => state.driver_ride_data.driverotpValidation
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directions, setDirections] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [cancelModal, setCancelModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const { OTP_confirm, Ride_completion, RideCancel } = useDriverWebSocket();

  let starting = data?.driver;
  let ending = data?.client;

  const { distance, duration, places, price, place_code } = ridedetails
    ? ridedetails.userRequest
    : {};

  console.log(otpvalidation, "otp validation");
  if (otpvalidation === "OTP_success" && place_code) {
    starting = place_code.location;
    ending = place_code.destination;
  }

  useEffect(() => {
    if (isLoaded && starting && ending) {
      const directionsService = new window.google.maps.DirectionsService();

      const directionsRequest = {
        origin: new window.google.maps.LatLng(starting.lat, starting.lng),
        destination: new window.google.maps.LatLng(ending.lat, ending.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(directionsRequest, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(
            result.routes[0].overview_path.map((point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }))
          );
          setZoomLevel(14);
        } else {
          console.error(`Directions request failed due to ${status}`);
          toast.error("Unable to retrieve directions. Please try again.");
        }
      });
    }
  }, [isLoaded, starting, ending]);

  const handleChange = (target, index) => {
    if (/^\d$/.test(target.value)) {
      const newOtp = [...otp];
      newOtp[index] = target.value;
      setOtp(newOtp);

      if (index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otp.length);
  }, [otp]);

  const handleConfirmride = () => {
    if (otp.length === 4) {
      const con_otp = otp.join("");
      console.log(con_otp, "user otp");
      OTP_confirm(con_otp);
    }
  };

  const handlefinishRide = () => {
    Ride_completion();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleshowCancelModal = () => {
    setCancelModal(true);
  };
  const handleCancelModalClose = () => {
    setCancelModal(false);
  };
  const handleCancelRide = () => {
    RideCancel();
  };
  return (
    <div className="flex flex-col md:flex-row   p-6 md:p-10 space-y-4 md:space-y-0 md:space-x-4">
      {showChat ? (
        <div className="w-full md:w-1/2">
          <Driver_chat setShowchat={setShowChat} />
        </div>
      ) : (
        <div className="w-full md:w-1/2  bg-blue-50 rounded-md p-4 font-bold flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Ride Details</h2>

            <div className="flex items-center mb-4 shadow-xl rounded-md p-4 bg-white">
              <img src={pickup} alt="Pickup" className="w-6 h-6 mr-2" />{" "}
              {/* Custom icon */}
              <div>
                <p>{places?.location}</p>
              </div>
            </div>

            <div className="flex items-center mb-4 shadow-xl rounded-md p-4 bg-white">
              <img src={dropoff} alt="Dropoff" className="w-6 h-6 mr-2" />{" "}
              {/* Custom icon */}
              <div>
                <p>{places?.destination}</p>
              </div>
            </div>

            <div className="flex items-center mb-4 shadow-xl rounded-md p-4 bg-white">
              <img src={time} alt="Time" className="w-6 h-6 mr-2" />{" "}
              {/* Custom icon */}
              <div>
                <p>{distance?.duration?.text}</p>
              </div>
            </div>

            <div className="flex items-center mb-4 shadow-xl rounded-md p-4 bg-white">
              <img src={distancee} alt="Distance" className="w-6 h-6 mr-2" />{" "}
              {/* Custom icon */}
              <div>
                <p>{distance?.distance?.text}</p>
              </div>
            </div>

            <div className="flex items-center mb-4 shadow-xl rounded-md p-4 bg-white">
              <img src={money} alt="Price" className="w-6 h-6 mr-2" />{" "}
              {/* Custom icon */}
              <div>
                <label className="block text-gray-700"></label>
                <p>₹ {(price * 0.9).toFixed(2)}</p>
              </div>
            </div>
            {otpvalidation !== "OTP_success" ? (
              <>
                <div className="flex items-center  mb-4 shadow-xl rounded-md p-4 bg-white">
                  <img src={key} alt="Key" className="w-6 h-6 mr-3" />
                  <div className="flex space-x-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={(e) => e.target.select()}
                        className="w-12 h-10 border border-gray-400 text-center text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleshowCancelModal}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:scale-105 transition-all duration-300"
                  >
                    Cancel Ride
                  </button>
                  {cancelModal && (
                    <DriverRideCancel
                      onConfirm={handleCancelRide}
                      onCancel={handleCancelModalClose}
                    />
                  )}
                  <button
                    onClick={handleConfirmride}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:scale-105 transition-all duration-300"
                  >
                    Confirm Ride
                  </button>
                  <button
                    onClick={() => setShowChat(true)}
                    className="bg-black text-white py-2 px-4 font-bold shadow-xl rounded-md flex items-center gap-2 hover:scale-105 transition-all duration-300"
                  >
                    <ChatBubbleLeftIcon className="w-5 h-5" /> {/* Chat Icon */}
                    Contact
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center   space-x-6 bg-white shadow-xl p-4 rounded-md">
                <p className="text-base">
                  Finish when you've reached your destination !
                </p>
                <button
                  onClick={openModal}
                  className="bg-black border border-black text-lg font-semibold text-white px-4 py-2 rounded-md hover:bg-white hover:text-black "
                >
                  Finish the ride
                </button>
              </div>
            )}
          </div>
          <div>
            <Ride_finish_modal
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={handlefinishRide}
              amount={(price * 0.9).toFixed(2)}
            />
          </div>
        </div>
      )}

      {/* Right side with the map */}
      <div className="w-1/2 rounded-lg shadow-2xl bg-blue-100">
        <div  style={mapContainerStyle}>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={starting || defaultCenter}
              zoom={zoomLevel}
            >
              {directions && (
                <Polyline
                  path={directions}
                  options={{
                    strokeColor: "black",
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                  }}
                />
              )}
              {starting && <Marker position={starting} icon={pickupIcon} />}
              {ending && <Marker position={ending} icon={destinationIcon} />}
            </GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverMap;
