import React, { useEffect, useState } from "react";
import logo from "../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";


const Header = (props) => {
  const { ride, drive, user } = props.headprops;
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  
  const handleSignin = () => {
    navigate('/signin_selection', { state: { signin: true } });
  }

  const handleSignup = () => {
    navigate('/signin_selection', { state: { signin: false } });
  }


  
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black">
  <div className="flex flex-wrap items-center justify-between p-4">
    <div className="flex items-center">
    <Link to="/">
    <img src={logo} alt="Logo" className="h-12" />
      </Link>
      <div className="hidden sm:flex sm:space-x-8 pl-6">
        {ride && (
          <ScrollLink
            to="first_layout"
            smooth={true}
            duration={500}
            className="text-white font-extrabold cursor-pointer hover:text-yellow-500"
          >
            Ride 
          </ScrollLink>
        )}
        {drive && (
          <ScrollLink
            to="second_layout"
            smooth={true}
            duration={500}
            className="text-white font-extrabold cursor-pointer hover:text-yellow-500"
          >
            Drive
          </ScrollLink>
        )}
      </div>
    </div>

    <div className="flex items-center px-8 space-x-4">
    <Link className="text-white font-extrabold hidden sm:block pr-6">
        Help 
      </Link>
     
      
        <div className="flex space-x-3">
          <button
            onClick={handleSignin}
            className="bg-white h-7 w-[70px] rounded-md font-bold text-center"
          >
            Sign in
          </button>
          <button
            onClick={handleSignup}
            className="bg-yellow-500 h-7 w-[70px] rounded-md font-bold text-white text-center"
          >
            Sign up
          </button>
        </div>
      
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
          {ride && (
            <Link className="text-white font-extrabold">
              Ride
            </Link>
          )}
          {drive && (
            <Link className="text-white font-extrabold">
              Drive
            </Link>
          )}
          <Link className="text-white font-extrabold">About</Link>
          <Link className="text-white font-extrabold">Help</Link>
        </div>
      </div>
    )}
  </div>

  );
};

export default Header;
