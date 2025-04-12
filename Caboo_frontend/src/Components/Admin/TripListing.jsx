import React, { useEffect, useState } from "react";
import Sidebar_admin from "./Sidebar_admin";
import { useSelector } from "react-redux";
import useAdmin from "../../Hooks/useAdmin";
import Admin_header from "./Admin_header";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TripListing = () => {
  const alltrip = useSelector((state) => state.admin_data.allTrips);
  console.log(alltrip, "alltrip");
  const { GetTripdata } = useAdmin();
  const navigate = useNavigate();

  const current_page = alltrip && alltrip.current_page ? alltrip.current_page:1;
  const currentTrips = alltrip && alltrip.trips_data ? alltrip.trips_data:{};
  const total_pages= alltrip && alltrip.total_pages ? alltrip.total_pages:1;
  const [page, setPage] = useState(parseInt(current_page),1);
  console.log(page,'page')

 
  useEffect(() => {
    const tripdata = async () => {
      await GetTripdata({ page: page });
    };
    tripdata()
  },[page]);

  return (
    <div className="p-10">
    
      <div className=" flex flex-col ">
        <h1 className="text-3xl  text-black  font-bold mb-5">All trips</h1>
        {/* Table Container */}
        <div className=" bg-white rounded-lg shadow-lg">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  No
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  PickUp
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  DropOff
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  More
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTrips && currentTrips.length > 0 ? (
                currentTrips.map((data, index) => (
                  <tr
                    key={data.id}
                    className="relative hover:bg-gray-200 font-bold transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      {(() => {
                        const locationParts = data.location.split(", ");
                        return locationParts.length > 2
                          ? `${locationParts.slice(0, 2).join(", ")}, ...`
                          : data.location;
                      })()}
                    </td>
                    <td className="py-3 px-4">
                      {(() => {
                        const destinationParts = data.destination.split(", ");
                        return destinationParts.length > 2
                          ? `${destinationParts.slice(0, 2).join(", ")}, ...`
                          : data.destination;
                      })()}
                    </td>
                    <td className="py-3 px-4">{data.dateTime}</td>
                    <td
                      className={` py-3 px-4 ${
                        data.status === "pending"
                          ? "text-yellow-500"
                          : data.status === "cancelled"
                          ? "text-red-600"
                          : data.status === "completed"
                          ? "text-green-600"
                          : "text-black"
                      } `}
                    >
                      {data.status}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() =>
                          navigate("/tripmore", { state: { trips: data } })
                        }
                        className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-2 px-4 text-center">
                    <div>
                      <div className="animate-pulse flex flex-col items-center mt-10  gap-4 w-full">
                        {" "}
                        <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                        <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                        <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                        <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                        <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
                        <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              
            </tbody>
            
          </table>
          <div className="flex   justify-center space-x-3 my-5">
            {/* Previous Button */}
            <button
              disabled={page === 1}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Previous page"
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Current Page */}
            <span className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-medium">
              {page}
            </span>

            {/* Dots and Total Pages */}
            {page < total_pages - 1 && (
              <>
                <span className="text-gray-500 font-bold">. . .</span>
                <span className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-medium">
                  {total_pages}
                </span>
              </>
            )}

            {/* Next Button */}
            <button
              disabled={page === total_pages}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Next page"
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default TripListing;
