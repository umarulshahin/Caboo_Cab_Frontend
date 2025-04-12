import React, { useEffect, useState } from "react";
import logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/profile_img.png"
import { addClearUser, addToken_data, addUser } from "../../Redux/UserSlice";
import { backendUrl } from "../../Utils/Constanse";
import Cookies from "js-cookie"
import useUserWebSocket from "../../Socket/Socket";

const User_header = ({setStatus}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile,setprofile]=useState('')
  const [username,setUsername]=useState('')
  

  useUserWebSocket()
  
  const data = useSelector((state) => state.user_data.user_data);
  console.log(data)
  useEffect(()=>{
    
    if(data){
      const { profile, username, email, phone } = data[0];
      setprofile(profile)
      setUsername(username)
    }
    
  },[data])
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout=()=>{

    dispatch(addClearUser(null))
    Cookies.remove('userTokens')
    localStorage.removeItem('status')
    navigate("/")
  }
   
  const handleComponent=(value)=>{
    setStatus(value)
    setDropdownOpen(false)
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black">
  <div className="flex flex-wrap items-center justify-between p-4">
    <div className="flex items-center">
    <Link to="/userhome" >
    <img src={logo} alt="Logo" className="h-12" />
    
      </Link>
      <div className="hidden sm:flex sm:space-x-8 pl-20">
      <button onClick={()=>setStatus('home')} className="text-white font-extrabold hidden sm:block  ">Home</button>

       <Link to='/userRide' className="text-white font-extrabold hidden sm:block  ">Ride</Link>
      </div>
    </div>

    <div className="flex items-center px-8 space-x-4">
    <Link to='/confirmation' className="text-white font-extrabold hidden sm:block pr-6">
        Help
      </Link>
      {/* Profile Section */}
          <div className="relative flex items-center space-x-2">
                <img
        src={profile ? `${backendUrl}${profile}` : avatar}
        alt="Profile"
        className="h-8 w-8 rounded-full object-cover cursor-pointer"
        onClick={toggleDropdown}
        onError={(e) => {
          console.error("Error loading image:", e);
          e.target.src = avatar; // Fallback to avatar if image fails to load
        }}
      />
          <span className="text-white font-bold cursor-pointer" onClick={toggleDropdown}>
            {username}
          </span>
        
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute flex flex-col items-center   right-0 mt-52 w-48 font-bold bg-black  text-white rounded-sm shadow-lg">
              <button></button>
              <button onClick={()=>handleComponent('profile')}  className="block px-4 w-full py-2 hover:bg-gray-600">Profile</button>
              <button onClick={()=>handleComponent('wallet')} className="block w-full  px-4 py-2  hover:bg-gray-600">Wallet</button>
              <button className="block px-4 py-2 w-full hover:bg-gray-600">Settings</button>
              <button onClick={handleLogout}  className="block  w-full px-4 py-2 bg-red-600 hover:bg-gray-600">Logout</button>
            </div>
          )}
        </div>
        

    </div>

    <div className="block sm:hidden">
      <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
        <svg
          className="w-6 h-6"
          fill="none"

          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
    </div>

    {menuOpen && (
      <div className="w-full block sm:hidden">
        <div className="flex flex-col items-end space-y-2 pt-4">
          
          <Link className="text-white font-extrabold">About</Link>
          <Link className="text-white font-extrabold">Help</Link>
        </div>
      </div>
    )}
  </div>
  
</div>


  );
};

export default User_header;
