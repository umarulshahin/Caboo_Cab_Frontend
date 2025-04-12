import React, { useState } from 'react'

const Ride_finish_modal = ({ isOpen, onClose, onConfirm,amount }) => {
    if (!isOpen) return null;
     const [confirm,setConfirm]=useState(false)

    const handlefinishride=()=>{
      setConfirm(true)
      onConfirm()

    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        { !confirm ? 
        <div className="flex flex-col justify-center items-center bg-white rounded-lg p-6 shadow-xl w-1/2">
          <p className="mb-6 text-2xl font-bold text-black">
            Are you sure you've reached the passenger's destination?
          </p>
          <p className="mb-6 text-center text-base font-semibold text-gray-500">
            If the destination has been reached, finish the ride to allow the passenger to proceed with the payment.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-black bg-gray-300 hover:bg-gray-400 "
            >
              Cancel
            </button>
            <button
              onClick={handlefinishride}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-900"
            >
              Finish Ride
            </button>
          </div>
        </div>: 
        <div className="flex flex-col justify-center items-center bg-white rounded-lg p-6 shadow-xl w-1/2">
           <p className="mb-6 text-2xl font-bold text-black">
            Waiting for payment completion
            </p>
            <div className="loader border-r-2 rounded-full border-yellow-500 bg-yellow-300 animate-bounce
            aspect-square w-10 flex justify-center items-center text-yellow-700">
            $
            </div> 
            <span className="text-3xl my-6 text-green-600">₹ {amount}</span>
            <p className="mb-6 text-center font-semibold">
            After the payment is successfully completed, please note that it may take some time for the changes to reflect. Thank you for your patience.
            </p>

         </div>
        }
      </div>
    );
  };

export default Ride_finish_modal