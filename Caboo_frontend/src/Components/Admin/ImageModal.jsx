import React from "react";

const ImageModal = ({ show, imageSrc, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="relative bg-white p-6 rounded-lg max-w-3xl mx-auto ">
        <button
          className="absolute top-0 right-0 mr-2  text-black"
          onClick={onClose}
        >
          X
        </button>
        <img src={imageSrc} alt="Large view" className="max-w-full h-[500px] object-contain" />
      </div>
    </div>
  );
};

export default ImageModal;
