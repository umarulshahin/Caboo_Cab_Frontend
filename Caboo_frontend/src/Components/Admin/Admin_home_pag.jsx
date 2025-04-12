import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, BarElement, CategoryScale, LinearScale, ArcElement } from "chart.js";
import useAdmin from "../../Hooks/useAdmin";
import Sidebar_admin from "./Sidebar_admin";
import { get_Driver_url, get_Users_url } from "../../Utils/Constanse";
import { useSelector } from "react-redux";
import { FaUsers, FaCar, FaMoneyBill, FaTripadvisor, FaBan, FaMoneyCheckAlt } from 'react-icons/fa';  // Import relevant icons


// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const Admin_home_page = () => {
  const { GetUsers } = useAdmin();
  const [userData, setUserData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const drivers = useSelector((state) => state.admin_data.Driver_list || []);
  const Users = useSelector((state) => state.admin_data.users_list);
  const alltrip = useSelector((state) => state.admin_data.allTrips);
  const [profit, setProfit] = useState(0);
  const [cancelledtrips, setCancelledtrips] = useState(0);
  const [totalamount, setTotalAmount] = useState(0);
  const { GetTripdata } = useAdmin();


  useEffect(() => {
    const fetchData = async () => {
      const userResponse = await GetUsers(get_Users_url, "user");
      const driverResponse = await GetUsers(get_Driver_url, "driver");

      GetTripdata({page:'all'});

      if (userResponse) {
        setUserData(userResponse.data);
      } else if (driverResponse) {
        setDriverData(driverResponse.data);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (alltrip && alltrip.length > 0) {
      const totalProfit = alltrip.reduce((accumulator, data) => {
        if (data.status === "completed") {
          return accumulator + data.amount;
        }
        return accumulator;
      }, 0);

      const totalamount = alltrip.reduce((accumulator, data) => {
        return accumulator + data.amount;
      }, 0);

      const canceltrips = alltrip.reduce((accumulator, data) => {
        if (data.status === 'cancelled') {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      setCancelledtrips(canceltrips);
      setTotalAmount(totalamount);
      setProfit(totalProfit);
    }
  }, [alltrip]);

  // Process Monthly Trip Data (group by months)
  const getMonthName = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(date);
    return monthNames[d.getMonth()];
  };

  const monthlyTrips =alltrip.length>0 && alltrip.reduce((acc, trip) => {
    const month = getMonthName(trip.dateTime);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthlyTripLabels = Object.keys(monthlyTrips);
  const monthlyTripData = Object.values(monthlyTrips);

  // Prepare Chart Data for Monthly Trips
  const tripData = {
    labels: monthlyTripLabels,
    datasets: [
      {
        label: "Trips",
        data: monthlyTripData,
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        borderWidth: 2,
      },
    ],
  };


  // Prepare Cancelled vs Completed Data for Bar Chart
  const completedTrips =alltrip.length>0 && alltrip.filter(trip => trip.status === "completed").length;
  const pendingTrips =alltrip.length>0 && alltrip.filter(trip=> trip.status === "pending").length;
  const cancelData = {
    labels: ["Completed", "pending", "Cancelled"],
    datasets: [
      {
        label: "Trips",
        data: [completedTrips, pendingTrips, cancelledtrips],
        backgroundColor: ["#32CD32", "#FF8C00", "#FF0000"],
      },
    ],
  };

  return (
    <div className="p-10">
    
      <div className=" flex flex-col  ">
        <h1 className="text-3xl  text-black  font-bold mb-5">Admin Dashboard</h1>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 text-white md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-yellow-500 hover:bg-yellow-600 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Total Users</h2>
            <FaUsers size={30} /> {/* Icon for Total Users */}
          </div>
          <p className="text-2xl font-bold">{Users && Users.length}</p>
        </div>

        <div className="bg-blue-500 hover:bg-blue-600 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Total Drivers</h2>
            <FaCar size={30} /> {/* Icon for Total Drivers */}
          </div>
          <p className="text-2xl font-bold">{drivers && drivers.length}</p>
        </div>

        <div className="bg-green-500 hover:bg-green-600 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Total Profit</h2>
            <FaMoneyBill size={30} /> {/* Icon for Total Profit */}
          </div>
          <p className="text-2xl font-bold">₹ {profit > 0 ? profit * 10 / 100 : 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 text-white lg:grid-cols-3 gap-6 py-5">
        <div className="bg-cyan-500 hover:bg-cyan-600 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Total Trips</h2>
            <FaTripadvisor size={30} /> {/* Icon for Total Trips */}
          </div>
          <p className="text-2xl font-bold">{alltrip && alltrip.length}</p>
        </div>

        <div className="bg-red-500  hover:bg-red-600 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Cancelled Trips</h2>
            <FaBan size={30} /> {/* Icon for Cancelled Trips */}
          </div>
          <p className="text-2xl font-bold">{cancelledtrips}</p>
        </div>

        <div className="bg-lime-500 hover:bg-lime-600 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Total Trips Amount</h2>
            <FaMoneyCheckAlt size={30} /> {/* Icon for Total Trips Amount */}
          </div>
          <p className="text-2xl font-bold">₹ {totalamount}</p>
        </div>
      </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Monthly Trip Data</h2>
            <Line data={tripData} options={{ responsive: true }} />
          </div>


          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Trips Details</h2>
            <Bar data={cancelData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_home_page;
