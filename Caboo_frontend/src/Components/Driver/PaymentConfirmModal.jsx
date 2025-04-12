import React, { useState } from 'react';
import useDriverWebSocket from '../../Socket/DriverSocket';
import { useSelector } from 'react-redux';
const PaymentConfirmModal = () => {

  const {Paymentconfirm}=useDriverWebSocket()
  const ridedetails = useSelector((state)=>state.driver_ride_data.driverrideDetails);
  const applyoffer = useSelector((state)=>state.driver_data.applyoffer)
  const [offeramount,setOfferamount] = useState(0)
  console.log(ridedetails,'ride details')

  const {  price} = ridedetails ? ridedetails.userRequest : {};
  let balance=0
  if(applyoffer){
    console.log(applyoffer,'appaly offer')
    balance = price * applyoffer.discount/100
    if (balance > applyoffer.max_amount){
      balance = applyoffer.max_amount
    }
    // setOfferamount(balance)
  }

  
  return (
     ( <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
        <h2 className="text-2xl font-bold text-center mb-4">Confirm Payment Receipt</h2>
        <span className='text-xl font-bold text-center'>Passenger will pay the fare charge <span className="font-bold text-green-600">₹ {balance ?  (price * 0.9).toFixed(2)-(balance * 0.9).toFixed(2) : (price * 0.9).toFixed(2)} </span> as CASH IN HAND</span>
        <p className="text-lg text-center font-semibold mb-6">
          Did you receive the cash payment ?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={Paymentconfirm}
            className="bg-black text-white  font-bold py-2 px-4 rounded-lg hover:bg-gray-500"
          >
            Yes, Received
          </button>
        
        </div>
      </div>
    </div>)
  );
}

export default PaymentConfirmModal;
