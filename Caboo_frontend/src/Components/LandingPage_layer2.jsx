import React from "react";
import driver_img from "../assets/driver_Layout.jpg";

const LandingPage_layer2 = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row" id="second_layout">
      <div className="hidden md:flex w-full md:w-3/6 items-center justify-center">
        <img className="h-[400px]" src={driver_img} alt="driver image" />
      </div>
      <div className="w-full md:w-3/6 flex flex-col items-center justify-center px-6 md:pl-10 h-full md:h-auto">
        <div className="w-full text-center md:text-start">
          <span className="font-bold text-3xl">
            Drive when you <br /> want, make what <br /> you need
          </span>
        </div>
        <div className="w-full text-center md:text-start mt-5">
          <span>
            Make money on your schedule with deliveries or rides—or <br />
            both. You can use your own car or choose a rental <br />
            through Caboo.
          </span>
          <br />
          <button className="bg-black text-white font-bold h-10 w-32 rounded-md mt-5">
            Get start
          </button>
          <span className="block md:inline-block ml-0 md:ml-10 underline mt-5 md:mt-0">
            Already have an account? Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage_layer2;
