import React from 'react';

const RideRequestModal = ({ show, onAccept, onDecline, userData }) => {
    if (!show) return null;
    console.log(userData, 'user data coming');
    const { distance, places, price } = userData.userRequest;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-7xl">
        <div className="flex justify-center items-center mb-6">
            <span className="mr-3 text-3xl">🔔</span> 
            <h2 className="text-2xl font-bold text-center">New Ride Request</h2>
        </div>

        <div className="rounded-md p-4 ">
        <div className="grid grid-cols-5 text-xl border-b-2 p-2 space-x-8 border-black font-bold text-black shadow-lg">
       
                <h1>Pick Up</h1>
                <h1>Drop Off</h1>
                <h1>Distance</h1>
                <h1>Time</h1>
                <h1>Amount</h1>
            </div>
            <div className="grid grid-cols-5 mt-4 text-gray-500 text-lg font-semibold space-x-8">
                <span>{places.location}</span>
                <span>{places.destination}</span>
                <span>{distance.distance.text}</span>
                <span>{distance.duration.text}</span>
                <span className='flex flex-col space-y-4'>
                    <span>₹ {price}</span>
                    <span className="text-red-600">- ₹ {(price * 0.10).toFixed(2)}</span> 
                    <span>Total Amount</span>
                    <span className='text-black font-bold ' >₹ {(price * 0.9).toFixed(2)}</span>
                </span>
            </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
            <button
                onClick={onDecline}
                className="hover:bg-black font-bold hover:text-white text-black border border-gray-700 px-6 py-2 rounded-lg"
            >
                Decline
            </button>
            <button
                onClick={onAccept}
                className="bg-black font-bold hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
            >
                Accept
            </button>
        </div>
    </div>
</div>

    );
};

export default RideRequestModal;
