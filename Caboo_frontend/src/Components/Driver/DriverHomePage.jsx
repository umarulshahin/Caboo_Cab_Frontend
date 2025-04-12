import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const DriverHomePage = (trip_data) => {
  const {count, cancel, amount, currentMonth,lastweekdata,monthlydata} = trip_data.trip_data || {};
 
  // Sample data for monthly rides
  const monthlyRidesData = [
    { month: 'Jan', rides: 45 },
    { month: 'Feb', rides: 52 },
    { month: 'Mar', rides: 48 },
    { month: 'Apr', rides: 70 },
    { month: 'May', rides: 61 },
    { month: 'Jun', rides: 85 },
  ];

  // Sample data for daily earnings
  const dailyEarningsData = [
    { day: 'Mon', earnings: 120 },
    { day: 'Tue', earnings: 150 },
    { day: 'Wed', earnings: 180 },
    { day: 'Thu', earnings: 200 },
    { day: 'Fri', earnings: 250 },
    { day: 'Sat', earnings: 300 },
    { day: 'Sun', earnings: 280 },
  ];

  return (
    <div className="pt-24">
      <div className="flex justify-evenly bg-gray-950 p-4 rounded-lg mx-10 my-14">
        <div className="relative drop-shadow-xl w-80 h-40 overflow-hidden rounded-xl bg-[#3d3c3d]">
          <div className="absolute flex flex-col items-center space-y-6 text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-gradient-to-br from-blue-600 to-blue-300 hover:scale-105 transition-all duration-300 delay-100">
            <span className="font-bold text-xl pt-6 w-fit h-fit">This Month's Rides</span>
            <h1 className="font-bold text-5xl">{currentMonth? currentMonth:0}</h1>

          </div>
          <div className="absolute flex items-center w-80 h-40 bg-white blur-[50px] -left-1/2 -top-1/2"></div>
        </div>
        <div className="relative drop-shadow-xl w-80 h-40 overflow-hidden rounded-xl bg-[#3d3c3d]">
          <div className="absolute flex flex-col items-center space-y-6 text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-gradient-to-br from-green-600 to-green-400 hover:scale-105 transition-all duration-300 delay-100">
            <span className="pt-4 font-bold text-xl">Total Earnings</span>
            <h1 className="font-bold text-5xl">₹ {amount ? amount : 0}</h1>

          </div>
          <div className="absolute w-56 h-40 bg-white blur-[50px] -left-1/2 -top-1/2"></div>
        </div>
        <div className="relative drop-shadow-xl w-80 h-40 overflow-hidden rounded-xl bg-[#3d3c3d]">
          <div className="absolute flex flex-col items-center space-y-6 text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-gradient-to-br from-yellow-600 to-yellow-300 hover:scale-105 transition-all duration-300 delay-100">
            <span className="pt-4 font-bold text-xl">Total Rides</span>
            <h1 className="font-bold text-5xl">{count ? count : 0}</h1>

          </div>
          <div className="absolute w-56 h-40 bg-white blur-[50px] -left-1/2 -top-1/2"></div>
        </div>
        <div className="relative drop-shadow-xl w-80 h-40 overflow-hidden rounded-xl bg-[#3d3c3d]">
          <div className="absolute flex flex-col items-center space-y-6 text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-gradient-to-br from-red-600 to-red-400 hover:scale-105 transition-all duration-300 delay-100">
            <span className="pt-4 font-bold text-xl">Cancelled Rides</span>
            <h1 className="font-bold text-5xl">{cancel? cancel : 0}</h1>

          </div>
          <div className="absolute w-56 h-40 bg-white blur-[50px] -left-1/2 -top-1/2"></div>
        </div>
      </div>

      {/* New section for graphs */}
      <div className="flex justify-between bg-gray-950 p-4 rounded-lg mx-10 my-14">
        <div className="w-[48%]">
          <h2 className="text-white text-xl font-bold mb-4">Monthly Rides</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlydata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rides" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-[48%]">
          <h2 className="text-white text-xl font-bold mb-4">Daily Earnings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lastweekdata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DriverHomePage;