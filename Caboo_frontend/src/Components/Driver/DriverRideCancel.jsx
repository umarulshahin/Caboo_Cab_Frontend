import React from 'react'

const DriverRideCancel = ({onConfirm,onCancel}) => {
    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 ">
            <h2 className="text-2xl font-bold text-center mb-4">Confirm Ride Cancellation</h2>
            <p className="text-lg text-center mb-6">
              Are you sure you want to cancel your trip ? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onConfirm}
                className="bg-red-500 font-bold text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Yes, Cancel Ride
              </button>
              <button
                onClick={onCancel}
                className="bg-gray-300 font-bold text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      );
    };
    

export default DriverRideCancel