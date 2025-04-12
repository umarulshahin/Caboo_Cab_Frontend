import React, { useState, useEffect } from 'react';
import { Modal } from '@mui/material';

const RideWaitingModal = ({ open, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (open) {
      setProgress(0);
      setIsLoading(true);
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsLoading(false);
            setIsSearching(true);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);
    }
  }, [open]);

  const handleCancelRide = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={(_, reason) => (reason === 'backdropClick' || reason === 'escapeKeyDown' ? null : onClose())}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 max-w-lg text-center">
          {isLoading ? (
            <>
              <h2 className="text-lg font-semibold mb-4">Sit back and relax! We're connecting with the best drivers in your area.</h2>
              <div className="text-center mb-4">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>
                <h2 className="text-zinc-900 mt-4">Searchin...</h2>
                <p className="text-zinc-600">Your adventure is about to begin</p>
              </div>
              <p className="text-gray-400 text-sm">Your safety and satisfaction are paramount to us. We appreciate your patience as we carefully select the perfect driver to ensure a smooth journey for you.</p>
            </>
          ) : (
            <>
              <h2 className=" mb-4 font-bold text-xl ">Taking longer than usual! <br /><span className='text-base '>Don't worry, we got you!</span> </h2>
              <div className="flex justify-center mb-4">
                <div className="w-[65px] h-[65px] border-8 border-[#ee9b00a6] rounded-full relative">
                  <span className="block bg-[#ee9b00] w-[6px] h-[22px] rounded-full absolute top-[24.5px] left-[21px] origin-top animate-spin-slow"></span>
                  <span className="block bg-[#ee9b00] w-[6px] h-[17px] rounded-full absolute top-[24.5px] left-[21px] origin-top animate-spin-slower"></span>
                  <span className="block bg-[#ee9b00] w-[10px] h-[10px] rounded-full absolute top-[19px] left-[19px]"></span>
                </div>
              </div>
              <p className="text-gray-900 mb-4">All the drivers seem busy. But if you’re ready to wait a little more, we can get you the best driver available.</p>
            </>
          )}
          <button
            onClick={handleCancelRide}
            className="mt-4 px-4 py-2 font-bold  text-black border border-black rounded hover:bg-black  hover:text-white"
          >
            {isLoading ? 'Cancel Ride' : 'Cancel Searching'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RideWaitingModal;
