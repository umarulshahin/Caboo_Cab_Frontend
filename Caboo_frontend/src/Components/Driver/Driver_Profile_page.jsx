import React, { useEffect, useState } from "react";
import profile_img_placeholder from "../../assets/profile_img.png";
import useGetUser from "../../Hooks/useGetUser";
import { useSelector } from "react-redux";
import { backendUrl, Driver_status_url } from "../../Utils/Constanse";
import { faEdit, faCamera, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserEdit from "../user_side/UserEdit";
import { profileUpdate_url } from "../../Utils/Constanse";
import Vehicle_documents from "./Vehicle_documents";
import useDriver from "../../Hooks/useDriver";

const Driver_Profile_page = () => {
  const [profile_img, setProfileImage] = useState("");
  const { img_validate } = useGetUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [id, setId] = useState("");
  const [showDocuments, setShowDocuments] = useState(false);
  const data = useSelector((state) => state.driver_data.driver_data);
  const { ProfilUpdate, Get_data } = useGetUser();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const { Driver_status } = useDriver();
  const [location,setlocation]=useState({ latitude: null, longitude: null })
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);


  useEffect(() => {
    if (data && data.length > 0) {
      const { profile, username, email, phone, id, referral_code } = data[0].customuser || {};
      const { current_Status } = data[0] || {};
      setProfileImage(profile);
      setEmail(email || ""); 
      setPhone(phone);
      setUsername(username);
      setId(id);
      setReferralCode(referral_code || "");
      setStatus(current_Status);
      setIsFetchingLocation(current_Status)
    }
    console.log("yes working")
  }, [data]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/;
      if (!allowedExtensions.test(file.name)) {
        alert("Please upload an image file (JPEG, JPG, PNG, GIF, webp).");
        return;
      } else {
        reader.onload = (e) => {
          img_validate(file, id, 'driver', email);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleEditClick = () => {
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleSave = (updatedData) => {
    updatedData["id"] = id;
    ProfilUpdate(updatedData, profileUpdate_url, 'driver', email);
  };

  const toggleDocuments = () => {
    setShowDocuments(!showDocuments);
  };

  useEffect(()=>{
    console.log(isFetchingLocation)
    if(isFetchingLocation){
    const locationFetcher=()=>{
          console.log(location,"location")
          if(navigator.geolocation){
              navigator.geolocation.getCurrentPosition(
                (position)=>{
                  setlocation({
                    latitude:position.coords.latitude,
                    longitude:position.coords.latitude,
                  });
                },
                (error)=>{
                  console.error('Error fetching location:', error)
                }

              )

          }else{
            console.error('Geolocation is not supported by this browser.');

          }

    }

    locationFetcher()

    const intervalid = setInterval(locationFetcher,10000)
    return ()=> clearInterval(intervalid)
  }

  
  },[isFetchingLocation])

  const handleToggle = () => {
    console.log(isFetchingLocation)
    const updatedData = {
      ...data[0],
      current_Status: !data[0].current_Status
    };
    Driver_status(Driver_status_url, updatedData);
    setIsFetchingLocation(!data[0].current_Status)

  };

  return (
    <div className="flex min-h-screen mt-16 bg-gray-100 justify-center">
      <div className="w-full max-w-4xl p-10 flex flex-col items-center bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl text-gray-800 font-bold mb-6">Account Info</h1>
        <div className="relative mb-6">
          <img
            src={profile_img ? `${backendUrl}${profile_img}` : profile_img_placeholder}
            alt="User Profile"
            className="h-40 w-40 rounded-full object-cover border-4 border-gray-300"
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl rounded-full opacity-0 hover:opacity-100 cursor-pointer">
            <FontAwesomeIcon icon={faCamera} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-14 h-6 my-5 select-none flex flex-row">
            <input
              id="check-apple"
              type="checkbox"
              className="absolute opacity-0 w-full h-full"
              checked={status}
              onChange={handleToggle}
            />
            <label
              htmlFor="check-apple"
              className={`absolute top-0 left-0 w-full h-full rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                status ? 'bg-gradient-to-b from-green-400 to-green-500' : 'bg-gradient-to-b from-gray-400 to-gray-200'
              }`}
            ></label>
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
                status ? 'transform translate-x-8' : ''
              }`}
            ></div>
          </div>
          <span className="font-bold text-black text-base">{status ? "Online" : "Offline"}</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold mb-1">Name</label>
              <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                <span className="text-gray-800 font-semibold">{username}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold mb-1">Email</label>
              <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                <span className="text-gray-800 font-semibold">{email}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold mb-1">Phone</label>
              <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                <span className="text-gray-800 font-semibold">{phone}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold mb-1">Referral Code</label>
              <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                <span className="text-gray-800 font-semibold">user1234{referralCode}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              className="px-8 py-3 rounded-full bg-black text-white font-bold transition duration-500 hover:bg-gray-500 hover:shadow-lg hover:shadow-gray-500/50 transform hover:scale-110 active:bg-gray-700 active:duration-250 active:shadow-none active:scale-95"
              onClick={handleEditClick}
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit Profile
            </button>
            <button
              className="px-8 py-3 rounded-full bg-black text-white font-bold transition duration-500 hover:bg-gray-500 hover:shadow-lg hover:shadow-gray-500/50 transform hover:scale-110 active:bg-gray-700 active:duration-250 active:shadow-none active:scale-95"
              onClick={toggleDocuments}
            >
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
              View Documents
            </button>
          </div>
          {showDocuments && <Vehicle_documents />}
        </div>
      </div>
      <UserEdit
        isOpen={modalIsOpen}
        onClose={handleModalClose}
        user={{ username, email, phone, referralCode }}
        onSave={handleSave}
      />
    </div>
  );
};

export default Driver_Profile_page;
