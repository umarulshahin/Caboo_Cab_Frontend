import React, { useEffect, useState } from "react";
import profile_img_placeholder from "../../assets/profile_img.png";
import useGetUser from "../../Hooks/useGetUser";
import { useSelector } from "react-redux";
import { backendUrl } from "../../Utils/Constanse";
import { faEdit, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserEdit from "./UserEdit";
import { profileUpdate_url } from "../../Utils/Constanse";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const UserProfile_main = () => {
  const [profile_img, setProfileImage] = useState("");
  const { img_validate } = useGetUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [id, setId] = useState("");
  const data = useSelector((state) => state.user_data.user_data);
  const { ProfilUpdate } = useGetUser();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (data) {
      const { profile, username, email, phone, id, referral_code } = data[0];
      setProfileImage(profile);
      setEmail(email);
      setPhone(phone);
      setUsername(username);
      setId(id);
      setReferralCode(referral_code || "");
    }
  }, [data]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      const allowedExtensions = /.(jpg|jpeg|png|gif|webp)$/;
      if (!allowedExtensions.test(file.name)) {
        alert("Please upload an image file (JPEG, JPG, PNG, GIF, webp).");
        return;
      } else {
        reader.onload = (e) => {
          img_validate(file, id);
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
    ProfilUpdate(updatedData, profileUpdate_url);
  };

  console.log(profile_img, "profile image ");

  return (
    <div className="flex w-screen min-h-screen mt-20 bg-gray-100 justify-center items-center">
      <div className="p-12 flex flex-col items-center bg-white shadow-lg rounded-lg w-full max-w-2xl">
        <h1 className="text-4xl text-gray-800 font-bold mb-8">Account Info</h1>
        <div className="relative mb-8">
          <img
            src={
              profile_img
                ? `${backendUrl}${profile_img}`
                : profile_img_placeholder
            }
            alt="User Profile"
            onError={(e) => {
              console.error("Error loading image:", e);
              e.target.src = profile_img_placeholder; // Fallback to avatar if image fails to load
            }}
            className="h-48 w-48 rounded-full object-cover border-4 border-gray-300"
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
        <div className="bg-white pb-8 rounded-lg shadow-md w-full">
          <div className="grid grid-cols-1 gap-4 rounded-lg">
            <div className="flex items-center justify-between border-b border-gray-300 py-4">
              <label className="text-gray-600 font-semibold text-lg w-1/3">
                Name
              </label>
              <span className="text-gray-800 font-bold text-lg w-2/3 text-right">
                {username}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-300 py-4">
              <label className="text-gray-600 font-semibold text-lg w-1/3">
                Email
              </label>
              <span className="text-gray-800 font-bold text-lg w-2/3 text-right">
                {email}{" "}
                <span className="text-green-600 text-base">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-base ml-2"
                  />{" "}
                  verified
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-300 py-4">
              <label className="text-gray-600 font-semibold text-lg w-1/3">
                Phone
              </label>
              <span className="text-gray-800 font-bold text-lg w-2/3 text-right">
                +91 {phone}{" "}
                {phone && (
                  <span className="text-green-600 text-base">
                    <FontAwesomeIcon icon={faCheckCircle} /> verified
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-300 py-4">
              <label className="text-gray-600 font-semibold text-lg w-1/3">
                Referral Code
              </label>
              <span className="text-gray-800 font-bold text-lg w-2/3 text-right">
                dffe87t{referralCode}
              </span>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              className="px-10 py-4 rounded-full bg-black text-white font-bold transition duration-500 hover:bg-gray-500 hover:shadow-lg hover:shadow-gray-500/50 transform hover:scale-110 active:bg-gray-700 active:duration-250 active:shadow-none active:scale-95"
              onClick={handleEditClick}
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit Profile
            </button>
          </div>
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

export default UserProfile_main;
