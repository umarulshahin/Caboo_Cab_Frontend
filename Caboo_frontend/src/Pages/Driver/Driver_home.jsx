import React, { useEffect, useState } from "react";
import Driver_Header from "../../Components/Driver/Driver_Header";
import Footer from "../../Components/Footer";
import useGetUser from "../../Hooks/useGetUser";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import DriverHomePage from "../../Components/Driver/DriverHomePage";
import useDriver from "../../Hooks/useDriver";

const Driver_home = () => {

  const { DriverTrips } = useDriver();
  const driver_token = useSelector((state) => state.driver_data.driver_token);
  const trips = useSelector((state) => state.driver_data.driverTrips);
  const driver = useSelector((state) => state.driver_data.driver_data);
  const [trip_data, setTripdata] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      if (driver_token.user_id) {
        await DriverTrips({ id: driver_token.user_id });
      }
    };

    fetchTrips();
  }, []);


  useEffect(() => {
    const message = localStorage.getItem("loginMessage");

    if (message) {
      toast.success(message);

      localStorage.removeItem("loginMessage");
    }
  }, []);
 
  console.log(trips,'trips')

  useEffect(() => {
    //* Dashboard data calculations
  
    if ( trips && trips.length>0){
      

    const today = new Date();
  
    // Get the current month and year
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
  
    // cancel trips
    const cancel = trips.reduce((total, item) => {
      return item.status === "cancelled" ? total + 1 : total;
    }, 0);
  
    // current month count
    const MonthCount = trips.reduce((count, trip) => {
      const tripDate = new Date(trip.dateTime);
      if (tripDate.getMonth() + 1 === currentMonth && tripDate.getFullYear() === currentYear) {
        return count + 1;
      }
      return count;
    }, 0);
  
    // total driver amount earned
    const amount = trips.reduce((total, item) => {
      return item.status === "completed" ? total + item.amount : total;
    }, 0);
  
    // total trip count
    const trip_count = trips.length;
  
    // Calculate first day of the last week
    const lastWeekStart = new Date();
    lastWeekStart.setDate(today.getDate() - 7);
  
    // 1. Calculate Monthly Rides Data
    const monthlyRidesData = trips.reduce((acc, trip) => {
      const tripDate = new Date(trip.dateTime);
      const tripMonth = tripDate.getMonth() + 1; // Month is zero-indexed
      const tripYear = tripDate.getFullYear();
  
      // Group by month
      if (tripYear === currentYear) {  
        const monthName = tripDate.toLocaleString('default', { month: 'short' }); // e.g., 'Jan'
  
        const existingMonth = acc.find(item => item.month === monthName);
        if (existingMonth) {
          existingMonth.rides += 1;
        } else {
          acc.push({ month: monthName, rides: 1 });
        }
      }
  
      return acc;
    }, []);
  
    // 2. Calculate Last Week's Daily Earnings Data
    const dailyEarningsData = trips.reduce((acc, trip) => {
      const tripDate = new Date(trip.dateTime);
  
      // Check if the trip is within the last week
      if (tripDate >= lastWeekStart && tripDate <= today && trip.status === "completed") {
        const dayName = tripDate.toLocaleString('default', { weekday: 'short' }); // e.g., 'Mon'
  
        const existingDay = acc.find(item => item.day === dayName);
        if (existingDay) {
          existingDay.earnings += trip.amount;
        } else {
          acc.push({ day: dayName, earnings: trip.amount });
        }
      }
  
      return acc;
    }, []);
  
    const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dailyEarningsData.sort((a, b) => orderedDays.indexOf(a.day) - orderedDays.indexOf(b.day));
  
    // Log or set data as needed
    console.log("Monthly Rides Data:", monthlyRidesData);
    console.log("Daily Earnings Data:", dailyEarningsData);
  
    // Prepare the final data object
    const data = {
      count: trip_count,
      cancel: cancel,
      amount: amount,
      currentMonth: MonthCount,
      lastweekdata: dailyEarningsData,
      monthlydata: monthlyRidesData,
    };
  
    if (data) {
      setTripdata(data);
    }
  } 

  }, [trips]);
  

  return (
    <div>
      <div>
        <Driver_Header />
      </div>
      <div className="flex-grow bg-black h-screen">
        <DriverHomePage trip_data={trip_data} />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Driver_home;
