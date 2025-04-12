import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { backendUrl } from '../../Utils/Constanse'
import { useSelector } from 'react-redux';

const Vehicle_documents = () => {
  
    const [open, setOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const document=useSelector((state)=>state.driver_data.driver_data)
  
    const handleOpenModal = (imageUrl) => {
      setCurrentImage(imageUrl);
      setOpen(true);
    };
  
    const handleCloseModal = () => {
      setOpen(false);
    };
  
    return (
      <div className="flex min-h-screen mt-16 bg-gray-100 justify-center">
        <div className="w-full max-w-4xl p-10 flex flex-col items-center bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl text-gray-800 font-bold mb-6">Vehicle Documents</h1>
          {/* Profile Image and other info */}
          
          {/* Document Information */}
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-medium">
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">Aadhaar</label>
                <div className="bg-white p-3 rounded-lg border border-gray-300">
                  {document[0].aadhaar}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">Vehicle Name</label>
                <div className="bg-white p-3 rounded-lg border border-gray-300">
                  {document[0].vehicle_name}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">Vehicle Number</label>
                <div className="bg-white p-3 rounded-lg border border-gray-300">
                  {document[0].vehicle_no }
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">Vehicle</label>
                <div className="bg-white p-3 rounded-lg border border-gray-300">
                  {document[0].Vehicle_type }
                </div>
              </div>
            </div>
  
            {/* Document Images Section */}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Document Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-2">RC Document</h3>
                  <img
                    src={`${backendUrl}${document[0].rc_img}`}
                    alt="RC Document"
                    className="rounded-lg w-full cursor-pointer"
                    onClick={() => handleOpenModal(`${backendUrl}${document[0].rc_img}`)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-2">Insurance</h3>
                  <img
                    src={`${backendUrl}${document[0].insurance}`}
                    alt="Insurance"
                    className="rounded-lg w-full cursor-pointer"
                    onClick={() => handleOpenModal(`${backendUrl}${document[0].insurance}`)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-2">Vehicle Photo</h3>
                  <img
                    src={`${backendUrl}${document[0].vehicle_photo}`}
                    alt="Vehicle Photo"
                    className="rounded-lg w-full cursor-pointer"
                    onClick={() => handleOpenModal(`${backendUrl}${document[0].vehicle_photo}`)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-2">License</h3>
                  <img
                    src={`${backendUrl}${document[0].license}`}
                    alt="License"
                    className="rounded-lg w-full cursor-pointer"
                    onClick={() => handleOpenModal(`${backendUrl}${document[0].license}`)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Modal for Viewing Larger Image */}
        <Modal open={open} onClose={handleCloseModal} center>
          <img src={currentImage} alt="Document" className="w-[500px] h-[400px] rounded-t-md" />
        </Modal>
      </div>
    );
  };


export default Vehicle_documents