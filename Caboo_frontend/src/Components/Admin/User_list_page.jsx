import React, { useEffect, useState } from "react";
import Sidebar_admin from "./Sidebar_admin";
import useAdmin from "../../Hooks/useAdmin";
import { useSelector } from "react-redux";
import BlockModal from "./BlockModal";
import {
  backendUrl,
  statusManagment_url,
  get_Users_url,
} from "../../Utils/Constanse";
import avatar from "../../assets/profile_img.png";

const User_list_page = () => {
  const { GetUsers, Usermanagement } = useAdmin();
  const [User_list, setUserlist] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalUsername, setModalUsername] = useState("");
  const User = useSelector((state) => state.admin_data.users_list);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  useEffect(() => {
    console.log("Fetching users...");
    GetUsers(get_Users_url, "user");
  }, [updateTrigger]);

  useEffect(() => {
    setUserlist(User);
  }, [User]);

  const handleBlockUnblock = (user) => {
    setSelectedUser(user);
    setModalUsername(user.username);
    setDropdownOpen(null)
    const action = user.is_active ? "block" : "unblock";
    setModalMessage(`Are you sure you want to ${action} this user?`);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedUser) {
      const action = selectedUser.is_active ? "block" : "unblock";
      setModalOpen(false);
      setSelectedUser(null);

      const data = {
        id: selectedUser.id,
        action: action,
      };

      try {
        await Usermanagement(statusManagment_url, data);
        setUpdateTrigger((prev) => prev + 1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleDropdownToggle = (userId) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  useEffect(()=>{
    const filteredDrivers = User.filter((data) => {
      if (activeTab === 'all') {
        return true; 
      } else if (activeTab === 'Active') {
        return data.is_active === true; 
      } else if (activeTab === 'Blocked') {
        return data.is_active === false; 
      }
      return false;
    });
  
    setUserlist(filteredDrivers);
  },[User,activeTab])

  return (
    <div className="p-10">
    
    <div className=" flex flex-col  ">
      <h1 className="text-3xl  text-black  font-bold mb-5">User Management</h1>
        <div className=" bg-white p-6 rounded-lg  shadow-lg">
          <div>
            <div className=" w-1/4 flex justify-evenly rounded-md my-4 overflow-hidden border-2 shadow-2xl">
              <button
                className={`flex-grow py-2 ${
                  activeTab != "all" && "hover:bg-gray-300 hover:text-black"
                } font-semibold transition-colors duration-500 pr-2 ${
                  activeTab === "all" ? "bg-black text-white" : "bg-transparent"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All
              </button>
              <button
                className={`flex-grow py-2 font-semibold ${
                  activeTab != "Active" && "hover:bg-gray-300 hover:text-black"
                }  transition-colors duration-500 pr-2 ${
                  activeTab === "Active"
                    ? "bg-black text-white"
                    : "bg-transparent"
                }`}
                onClick={() => setActiveTab("Active")}
              >
                Active
              </button>
              <button
                className={`flex-grow py-2 font-semibold ${
                  activeTab != "Blocked" && "hover:bg-gray-300 hover:text-black"
                } transition-colors duration-500 pr-2 ${
                  activeTab === "Blocked"
                    ? "bg-black text-white"
                    : "bg-transparent"
                }`}
                onClick={() => setActiveTab("Blocked")}
              >
                Blocked
              </button>
            </div>
          </div>
          <table className="min-w-full bg-white  rounded-lg overflow-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Profile
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Phone
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Wallet
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {User_list.map((data) => (
                <tr
                  key={data.id}
                  className="relative hover:bg-gray-200 font-bold transition-colors"
                >
                  <td className="py-3 px-4">{data.id}</td>
                  <td className="py-3 px-4">
                    <img
                      src={
                        data.profile ? `${backendUrl}${data.profile}` : avatar
                      }
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-4">{data.username}</td>
                  <td className="py-3 px-4">{data.phone}</td>
                  <td className="py-3 px-4">₹{data.wallet}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        data.is_active ? "text-green-600" : "text-red-600"
                      }
                    >
                      {data.is_active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => handleDropdownToggle(data.id)}
                      >
                        {data.is_active ? "Active" : "Blocked"}
                        <svg
                          className="-mr-1 ml-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 8a1 1 0 01.993-.883L7 7a1 1 0 011.414.293L10 9.586l1.293-1.293a1 1 0 011.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 01-.293-.707z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {dropdownOpen === data.id && (
                        <div
                          className="absolute z-50 mb-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby={`menu-button-${data.id}`}
                          style={{
                            bottom: `-150%`,
                          }}
                        >
                          <div className="p-1" role="none">
                            {data.is_active ? (
                              <button
                                onClick={() => handleBlockUnblock(data)}
                                className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                role="menuitem"
                              >
                                Block
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlockUnblock(data)}
                                className="block w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100"
                                role="menuitem"
                              >
                                Unblock
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BlockModal
        isOpen={modalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message={modalMessage}
        username={modalUsername}
      />
    </div>
  );
};

export default User_list_page;
