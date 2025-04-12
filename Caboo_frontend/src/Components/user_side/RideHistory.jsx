import React, { useEffect, useState } from 'react';
import useGetUser from '../../Hooks/useGetUser';
import { useSelector } from 'react-redux';
import { Ride_User_Data_url } from '../../Utils/Constanse';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RideHistory = () => {
    const [loading, setLoading] = useState(true);
    const { UserTabls } = useGetUser();
    const user = useSelector((state) => state.user_data.token_data);
    const trips = useSelector((state) => state.user_data.userTrips);
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const tripsPerPage = 5; // Number of trips per page

    useEffect(() => {
        const fetchTrips = async () => {
            if (user?.user_id) {
                try {
                    await UserTabls(Ride_User_Data_url, { id: user.user_id }, 'trip');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTrips();
    }, []);

    const formatAddress = (address) => {
        const parts = address?.split(',');
        if (parts && parts.length > 2) {
            return `${parts.slice(0, 2).join(',')}`;
        }
        return address || 'Unknown Address';
    };

    // Ensure `trips` is an array before using `.slice()`
    const validTrips = Array.isArray(trips) ? trips : [];

    // Pagination logic
    const indexOfLastTrip = currentPage * tripsPerPage;
    const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
    const currentTrips = validTrips.slice(indexOfFirstTrip, indexOfLastTrip);
    const totalPages = Math.ceil(validTrips.length / tripsPerPage);

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

    if (loading) {
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
                            <th className="py-3 px-8 text-left">More</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTrips.length > 0 ? (
                            currentTrips.map((data, index) => (
                                <tr key={data.orderId} className="border-b font-bold text-gray-800">
                                    <td className="py-2 px-4 text-left">{indexOfFirstTrip + index + 1}</td>
                                    <td className="py-2 px-2 text-left">
                                        {formatAddress(data.location || "Location A")}
                                    </td>
                                    <td className="py-2 px-2 text-left">
                                        {formatAddress(data.destination || "Location B")}
                                    </td>
                                    <td className="py-2 px-4 text-left">
                                        <span
                                            className={`font-bold ${
                                                data.status === 'pending'
                                                    ? 'text-orange-500'
                                                    : data.status === 'cancelled'
                                                    ? 'text-red-600'
                                                    : data.status === 'completed'
                                                    ? 'text-green-600'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {data.status || "Unknown"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-left font-bold">
                                        {data.dateTime}
                                    </td>
                                    <td className="py-2 px-4 text-left">
                                        <button onClick={() => navigate('/ridedetails', { state: { rides: data } })} className="bg-black font-bold text-white px-5 py-1 rounded hover:bg-gray-600">
                                            More
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">No Trips Available</td>
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
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
        {page}
    </button>
);

export default RideHistory;
