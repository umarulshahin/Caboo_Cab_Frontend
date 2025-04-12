import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCar,
  faUsers,
  faUserTie,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentPage } from "../../Redux/AdminSlice";

const Sidebar_admin = ({ activepage }) => {
  const currentpage = useSelector((state) => state.admin_data.currentpage);
  const dispatch = useDispatch();

  
  const [active, setActive] = useState('home'); 

  console.log(currentpage,'current page')
  useEffect(() => {
    activepage('home')
    setActive(currentpage); 
    activepage(currentpage)
  }, [currentpage]);

  const handleActivePage = (value) => {
    setActive(value); 
    activepage(value); 
    dispatch(addCurrentPage(value)); 
  };
  console.log(active)
  return (
    <div className="text-white rounded-md">
      <div className="flex flex-col items-start space-y-4 p-4">
        <button
          onClick={() => handleActivePage('home')}
          className={`flex items-center font-bold text-lg w-full py-2 px-4 hover:text-black hover:bg-gray-200 rounded transition-colors duration-200 ${
            active === 'home' ? 'bg-gray-300 text-black' : ''
          }`}
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
          Dashboard
        </button>

        <button
          onClick={() => handleActivePage('trip')}
          className={`flex items-center font-bold text-lg w-full py-2 px-4 hover:text-black hover:bg-gray-200 rounded transition-colors duration-200 ${
            active === 'trip' ? 'bg-gray-300 text-black' : ''
          }`}
        >
          <FontAwesomeIcon icon={faCar} className="mr-3" />
          Trips
        </button>

        <button
          onClick={() => handleActivePage('user')}
          className={`flex items-center font-bold text-lg w-full py-2 px-4 hover:text-black hover:bg-gray-200 rounded transition-colors duration-200 ${
            active === 'user' ? 'bg-gray-300 text-black' : ''
          }`}
        >
          <FontAwesomeIcon icon={faUsers} className="mr-3" />
          Users
        </button>

        <button
          onClick={() => handleActivePage('driver')}
          className={`flex items-center font-bold text-lg w-full py-2 px-4 hover:text-black hover:bg-gray-200 rounded transition-colors duration-200 ${
            active === 'driver' ? 'bg-gray-300 text-black' : ''
          }`}
        >
          <FontAwesomeIcon icon={faUserTie} className="mr-3" />
          Drivers
        </button>

        <button
          onClick={() => handleActivePage('coupon')}
          className={`flex items-center font-bold text-lg w-full py-2 px-4 hover:text-black hover:bg-gray-200 rounded transition-colors duration-200 ${
            active === 'coupon' ? 'bg-gray-300 text-black' : ''
          }`}
        >
          <FontAwesomeIcon icon={faTicketAlt} className="mr-3" /> Coupons
        </button>
      </div>
    </div>
  );
};

export default Sidebar_admin;
