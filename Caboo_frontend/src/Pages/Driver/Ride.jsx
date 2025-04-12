import React, { useState } from 'react';
import Driver_Header from '../../Components/Driver/Driver_Header';
import Footer from '../../Components/Footer';
import DriverMap from '../../Components/Driver/DriverMap';
import { useSelector } from 'react-redux';
import empty from '../../assets/empty.png'
import TripHistory from '../../Components/Driver/TripHistory';

const Ride = () => {
  const [selected, setSelected] = useState("current ride");
  const ridedetails = useSelector((state)=>state.driver_ride_data.driverrideDetails)
  console.log(ridedetails,'ride details')
  const [trip,settrip] = useState(true)
  return (
    <div>
      <Driver_Header />

      <div className="relative flex items-center mt-40 ml-10  w-96 bg-white text-black rounded-lg overflow-hidden border border-black">
      <label
        className={`flex justify-center items-center w-1/2 py-2 cursor-pointer font-semibold text-lg z-10 transition-colors ${
          selected === "current ride" ? "text-white" : "text-black"
        }`}
      >
        <input
          type="radio"
          name="value-radio"
          id="current ride"
          value="current ride"
          checked={selected === "current ride"}
          onChange={() => setSelected("current ride")}
          className="hidden"
        />

        <span>Current Ride</span>
      </label>
      <label
        className={`flex justify-center items-center w-1/2 py-3 cursor-pointer font-semibold text-lg z-10 transition-colors ${
          selected === "Ride History" ? "text-white" : "text-black"
        }`}
      >
        <input
          type="radio"
          name="value-radio"
          id="Ride History"
          value="Ride History"
          checked={selected === "Ride History"}
          onChange={() => setSelected("Ride History")}
          className="hidden"
        />
        <span>Ride History</span>
      </label>
      <span
        className={`absolute top-0 h-full w-1/2 bg-black transition-transform ${
          selected === "Ride History" ? "transform translate-x-full" : "n"
        }`}
      ></span>
    </div>
    <div className=' mb-10'>
    {selected === 'current ride' && (
        ridedetails ? (
            <DriverMap />
        ) : (
            <div className='flex justify-center items-center space-x-4'>
                <img className='size-32' src={empty} alt="empty" />
                <span className='text-3xl font-bold py-20 text-gray-400'>NO RIDE AVAILABLE</span>
            </div>
        )
    )}
      {selected === 'Ride History' && (
        trip ? (
            <TripHistory/>
        ) : (
            <div className='flex justify-center items-center space-x-4'>
                <img className='size-32' src={empty} alt="empty" />
                <span className='text-3xl font-bold py-20 text-gray-400'>NO RIDE AVAILABLE</span>
            </div>
        )
    )}
    </div>

      <Footer />
    </div>
  );
};

export default Ride;
