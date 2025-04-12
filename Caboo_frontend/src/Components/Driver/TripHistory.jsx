import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TripHistory = () => {
  const navigate = useNavigate();
  const trips = useSelector((state) => state.driver_data.driverTrips);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 10; 

  const totalPages = Math.ceil((trips?.length || 0) / tripsPerPage);

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = trips.length >0 ? trips.slice(indexOfFirstTrip, indexOfLastTrip) : [];

  const formatAddress = (address) => {
    const parts = address.split(",");
    if (parts.length > 3) {
      return `${parts.slice(0, 3).join(", ")}`;
    }
    return address;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (!trips) {
    return (
      <div className="w-full px-4 py-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Loading Ride History...</h2>
        <div className="spinner-border text-blue-500" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-10 py-6">
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200 text-gray-600 border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 border-r text-left">NO</th>
              <th className="py-3 px-2 border-r text-left">Pickup</th>
              <th className="py-3 px-2 border-r text-left">Dropoff</th>
              <th className="py-3 px-4 border-r text-left">Status</th>
              <th className="py-3 px-4 border-r text-left">Date</th>
              <th className="py-3 px-7 text-left ">More</th>
            </tr>
          </thead>
          <tbody>
            {currentTrips.length > 0 ? (
              currentTrips.map((data, index) => (
                <tr
                  key={data.orderId}
                  className="border-b text-gray-800 font-bold"
                >
                  <td className="py-2 px-4 text-left">
                    {indexOfFirstTrip + index + 1}
                  </td>
                  <td className="py-2 px-2 text-left">
                    {formatAddress(data.location || "Location A")}
                  </td>
                  <td className="py-2 px-2 text-left">
                    {formatAddress(data.destination || "Location B")}
                  </td>
                  <td className="py-2 px-4 text-left">
                    <span
                      className={`font-bold ${
                        data.status === "pending"
                          ? "text-orange-500"
                          : data.status === "cancelled"
                          ? "text-red-600"
                          : data.status === "completed"
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {data.status || "Unknown"}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-left">
                    {data.dateTime || "2024-09-05"}
                  </td>
                  <td className="py-2 px-4 text-left">
                    <button
                      onClick={() =>
                        navigate("/tripdetails", { state: { trips: data } })
                      }
                      className="bg-black text-white px-4 py-1 rounded hover:bg-gray-600"
                    >
                      More
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No Trips Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-4 mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-1">
          {currentPage > 2 && (
            <>
              <PageButton page={1} onClick={() => handlePageClick(1)} />
              {currentPage > 3 && <span className="text-gray-400">...</span>}
            </>
          )}
          
          {currentPage > 1 && <PageButton page={currentPage - 1} onClick={() => handlePageClick(currentPage - 1)} />}
          
          <PageButton page={currentPage} isActive onClick={() => handlePageClick(currentPage)} />
          
          {currentPage < totalPages && <PageButton page={currentPage + 1} onClick={() => handlePageClick(currentPage + 1)} />}
          
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <span className="text-gray-400">...</span>}
              <PageButton page={totalPages} onClick={() => handlePageClick(totalPages)} />
            </>
          )}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const PageButton = ({ page, isActive = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {page}
  </button>
);

export default TripHistory;