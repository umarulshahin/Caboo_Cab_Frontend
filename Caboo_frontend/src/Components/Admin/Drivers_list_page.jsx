import React, { useEffect, useState } from 'react';
import Sidebar_admin from './Sidebar_admin';
import useAdmin from '../../Hooks/useAdmin';
import { useSelector } from 'react-redux';
import { get_Driver_url, backendUrl } from '../../Utils/Constanse';
import { useNavigate } from 'react-router-dom';
import avatar from "../../assets/profile_img.png";

const Drivers_list_page = () => {
  const { GetUsers } = useAdmin();
  const navigate = useNavigate();
  const [activeTab , setActiveTab] = useState('all')
  const [User_list,setUserlist] = useState()

  useEffect(() => {

    GetUsers(get_Driver_url, "driver");
    
  }, []);

  const driver_list = useSelector((state) => state.admin_data.Driver_list || []);
  console.log(driver_list,'driver')

  const handleView = (data) => {
    navigate('/Documents', { state: { driver: data } });
  };
 

  useEffect(() => {
    // Filter driver_list based on the activeTab value
    const filteredDrivers = driver_list.filter((data) => {
      if (activeTab === 'all') {
        return true; 
      } else if (activeTab === 'Active') {
        return data.request === 'active'; 
      } else if (activeTab === 'Pending') {
        return data.request === 'pending'; 
      } else if (activeTab === 'Decline') {
        return data.request === 'decline'; 
      }
      return false;
    });
  
    setUserlist(filteredDrivers);
  }, [activeTab, driver_list]);
  

  return (
    <div className="p-10">
    
    <div className=" flex flex-col  ">
      <h1 className="text-3xl text-black font-bold mb-5">Driver Management</h1>
        {/* Table Container */}
        <div className=" bg-white p-6 rounded-lg shadow-lg">
          <div  >

        <div className='text-black  w-2/4 flex justify-evenly rounded-md my-4 overflow-hidden border-2 shadow-2xl'>
          <button 
            className={`flex-grow py-2 ${ activeTab != 'all' && "hover:bg-gray-300 hover:text-black"} font-semibold transition-colors duration-500 pr-2 ${
              activeTab === 'all' ? 'bg-black text-white' : 'bg-transparent'
            }`} 
            onClick={() => setActiveTab('all')}
          >
           All
          </button>
          <button 
            className={`flex-grow py-2 font-semibold ${ activeTab != 'Active' && "hover:bg-gray-300 hover:text-black"}  transition-colors duration-500 pr-2 ${
              activeTab === 'Active' ? 'bg-black text-white' : 'bg-transparent'
            }`} 
            onClick={() => setActiveTab('Active')}
          >
            Active
          </button>
          <button 
            className={`flex-grow py-2 font-semibold ${ activeTab != 'Pending' && "hover:bg-gray-300 hover:text-black"} transition-colors duration-500 pr-2 ${
              activeTab === 'Pending' ? 'bg-black text-white' : 'bg-transparent'
            }`} 
            onClick={() => setActiveTab('Pending')}
          >
            Pending
          </button>


          <button 
            className={`flex-grow py-2 font-semibold ${ activeTab != 'Decline' && "hover:bg-gray-300 hover:text-black"}  transition-colors duration-500 pr-2 ${
              activeTab === 'Decline' ? 'bg-black text-white' : 'bg-transparent'
            }`} 
            onClick={() => setActiveTab('Decline')}
          >
            Decline
          </button>
        </div>
        </div>

          <table className="min-w-full bg-white rounded-lg overflow-hidden">
          
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">ID</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Profile</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Name</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Phone</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Trip status</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Status</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Documents</th>
              </tr>
            </thead>
            <tbody>
              {User_list ? (
                User_list.map((data) => (
                  <tr key={data.id} className="relative hover:bg-gray-200 font-bold transition-colors">
                    <td className="py-3 px-4 text-gray-500">{data.customuser.id}</td>
                    <td className="py-3 px-4">
                      <img
                        src={data.customuser.profile ? `${backendUrl}${data.customuser.profile}` : avatar}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">{data.customuser.username}</td>
                    <td className="py-3 px-4">{data.customuser.phone}</td>
                    <td className= {` py-3 px-8 ${data.customuser.ride ? 'text-green-600' : 'text-red-600'}`}>{data.customuser.ride ? 'OnTrip':'idle'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          data.request === 'active'
                            ? 'text-green-600'
                            : data.request === 'pending'
                            ? 'text-orange-500'
                            : data.request === 'decline'
                            ? 'text-red-600'
                            : ''
                        }`}
                      >
                        {data.request === 'active'
                          ? 'Active'
                          : data.request === 'pending'
                          ? 'Pending'
                          : data.request === 'decline'
                          ? 'Decline'
                          : 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition"
                        onClick={() => handleView(data)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-2 px-4 text-center">No drivers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Drivers_list_page;
