import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiFlag, FiMapPin } from "react-icons/fi";
import { FaLocationArrow, FaSpinner } from "react-icons/fa";
import { useLoadScript } from "@react-google-maps/api";
import MapComponent from "../../Pages/user_side/Map";
import { useDispatch, useSelector } from "react-redux";
import { addCharges, addDistance, addPlaces } from "../../Redux/RideSlice";
import VehicleCard from "./VehicleCard";
import { toast } from "sonner";
import RideWaitingmodal from "./RideWaitingmodal";
import useWebSocket from "../../Socket/Socket";

const libraries = ["places"];

const UserHome_main = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_google_map_api_key,
    libraries,
  });
  const autoCompleteRef1 = useRef(null);
  const inputRef1 = useRef(null);
  const autoCompleteRef2 = useRef(null);
  const inputRef2 = useRef(null);
  const dispatch=useDispatch()
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [places,setplaces]= useState(null)
  const charges = useSelector((state)=>state.ride_data.charges)
  const distance = useSelector((state)=>state.ride_data.distance)
  const place_code = useSelector((state)=>state.ride_data.places)
  const user=useSelector((state=>state.user_data.token_data))
  const [modalOpen, setModalOpen] = useState(false);
  const { sendMessage } = useWebSocket();

  
  const options = {
    componentRestrictions: { country: "in" },
    fields: ["address_components", "geometry", "icon", "name", "formatted_address", "place_id", "types"],
    types: [],
  };

  const [locationCoords, setLocationCoords] = useState({ lat: null, lng: null });
  const [destinationCoords, setDestinationCoords] = useState({ lat: null, lng: null });
  const [loadingLocation, setLoadingLocation] = useState({ location: false, destination: false });
  const [updateMap, setUpdateMap] = useState(false); // New state for handling map update
  const initialValues = {
    location: "",
    destination: "",
  };
  const validationSchema = Yup.object().shape({
    location: Yup.string()
      .required("Location is required")
      .test(
        "not-equal-to-destination",
        "Location and Destination cannot be the same",
        function (value) {
          return value !== this.parent.destination;
        }
      ),
    destination: Yup.string()
      .required("Destination is required")
      .test(
        "not-equal-to-location",
        "Destination and Location cannot be the same",
        function (value) {
          return value !== this.parent.location;
        }
      ),
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {

    console.log("Form data:", values);
    setplaces(values)
    setSubmitting(false);
    setUpdateMap(true); 

  
  };

  const getCurrentLocation = (setFieldValue, field) => {

    if (navigator.geolocation) {
      setLoadingLocation((prevState) => ({ ...prevState, [field]: true }));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };

          geocoder.geocode({ location: latlng }, (results, status) => {
            setLoadingLocation((prevState) => ({ ...prevState, [field]: false }));
            if (status === "OK") {
              if (results[0]) {
                setFieldValue(field, results[0].formatted_address);
                if (field === "location") {
                  setLocationCoords({ lat: latitude, lng: longitude });
                } else {
                  setDestinationCoords({ lat: latitude, lng: longitude });
                }
              } else {
                console.log("No results found");
              }
            } else {
              console.log("Geocoder failed due to: " + status);
            }
          });
        },
        (error) => {
          setLoadingLocation((prevState) => ({ ...prevState, [field]: false }));
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleRide=(values)=>{
    if(values){

      const data={
        user_id:user.user_id,
        type:values.type,
        price:values.price,
        distance:distance,
        place_code:place_code,
        places:places
      }
      console.log(data,'user trip request data')
      sendMessage(data)
      handleOpenModal()

    }else{
      toast.warning("Please select a vehicle option to proceed")
    }
  }
  
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row justify-center items-center mx-10">
      <div className="flex flex-col bg-white shadow-lg rounded-md w-full lg:w-1/3 p-6 mb-4 lg:mb-0 lg:mr-4">
        <span className="font-bold text-3xl text-blue-500 text-center mb-10 p-10 ">
          Request a ride, hop in, and <br />enjoy the journey.
        </span>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue }) => {
            useEffect(() => {
              if (isLoaded) {
                if (inputRef1.current) {
                  autoCompleteRef1.current = new window.google.maps.places.Autocomplete(
                    inputRef1.current,
                    options
                  );
                  autoCompleteRef1.current.addListener("place_changed", () => {
                    const place = autoCompleteRef1.current.getPlace();
                    setFieldValue("location", place.formatted_address);
                    setLocationCoords({
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    });
                  });
                }
                if (inputRef2.current) {
                  autoCompleteRef2.current = new window.google.maps.places.Autocomplete(
                    inputRef2.current,
                    options
                  );
                  autoCompleteRef2.current.addListener("place_changed", () => {
                    const place = autoCompleteRef2.current.getPlace();
                    setFieldValue("destination", place.formatted_address);
                    setDestinationCoords({
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    });
                  });
                }
              }
            }, [isLoaded, setFieldValue]);

         

            return (
              <Form className="w-full">
                <div className="mb-4 relative">
                  <div className="relative">
                    <Field
                      name="location"
                      placeholder="Pickup location"
                      innerRef={inputRef1}
                      as="input"
                      className="block w-full p-2 border-b-2 border-gray-500 pl-10 pr-10 text-sm rounded-md"
                    />
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400 w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => getCurrentLocation(setFieldValue, "location")}
                      className="absolute inset-y-0 right-2 flex items-center"
                      title="Use current location"
                    >
                      {loadingLocation.location ? (
                        <FaSpinner className="text-gray-400 w-5 h-5 animate-spin" />
                      ) : (
                        <FaLocationArrow className="text-gray-400 w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-xs mt-1 ml-10"
                  />
                </div>

                <div className="mb-4 relative">
                  <div className="relative">
                    <Field
                      name="destination"
                      placeholder="Dropoff location"
                      innerRef={inputRef2}
                      as="input"
                      className="block w-full p-2 border-b-2 border-gray-500 pl-10 pr-10 text-sm rounded-md"
                    />
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <FiFlag className="text-gray-400 w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => getCurrentLocation(setFieldValue, "destination")}
                      className="absolute inset-y-0 right-2 flex items-center"
                      title="Use current location"
                    >
                      {loadingLocation.destination ? (
                        <FaSpinner className="text-gray-400 w-5 h-5 animate-spin" />
                      ) : (
                        <FaLocationArrow className="text-gray-400 w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="destination"
                    component="div"
                    className="text-red-500 text-xs mt-1 ml-10"
                  />
                </div>
                {distance && charges &&(
                  <div>

                  <div className="flex space-x-8 ">
                  <div className="bg-black w-1/2 text-white h-[90px] rounded-lg flex flex-col justify-center items-center">
                         <span className="font-bold text-sm">Total Distance </span>
                         <span className="font-bold text-2xl pt-2">{distance.distance.text}</span>
                  </div>
                  <div className="bg-black w-1/2 text-white h-[90px] rounded-lg flex flex-col justify-center items-center">
                         <span className="font-bold  text-sm">Total Duration</span>
                         <span className="font-bold text-2xl pt-2">{distance.duration.text}</span>
                  </div>
                </div>
                  <div className="mt-4">
                         <VehicleCard handleRide={setSelectedVehicle} />
                  </div>
                </div>
              )}

                <div className="flex gap-4 mt-4">
                  {!distance && !charges && (<button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-black text-white font-bold rounded-md w-full"
                  >
                    {isSubmitting ? "Submitting..." : "See price"}
                  </button>)}

                { distance && charges && (  <button
                    type="submit"
                    onClick={()=>handleRide(selectedVehicle)}
                    
                    className="px-4 py-2 bg-green-600 text-white font-bold rounded-md w-full"
                  >Confirm ride</button>)}
                  
                  <button
                    type="button"
                    onClick={()=>{
                      setFieldValue("location", "");
                      setFieldValue("destination", "");
                      setLocationCoords({ lat: null, lng: null });
                      setDestinationCoords({ lat: null, lng: null });
                      setUpdateMap(false); 
                      dispatch(addCharges(null))
                      dispatch(addPlaces(null))
                      dispatch(addDistance(null))
                      setSelectedVehicle(null)

                    }}
                    className="px-4 py-2 text-black border border-black font-bold rounded-md hover:bg-black hover:text-white w-full"
                  >
                    Clear
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div className="flex-grow h-full w-full mx-20 py-36 lg:w-2/3 bg-white rounded-md overflow-hidden">
        <MapComponent
          locationCoords={updateMap ? locationCoords : { lat: null, lng: null }}
          destinationCoords={updateMap ? destinationCoords : { lat: null, lng: null }}
          />
      </div>
      <div>
        <RideWaitingmodal open={modalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default UserHome_main;
