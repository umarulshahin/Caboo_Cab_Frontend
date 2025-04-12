import React, { useState } from "react";

const DeclineModal = ({ show, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState({ reason: "", comments: "" });

  const handleConfirm = () => {
    // Validation
    let valid = true;
    if (!reason) {
      setErrors((prevErrors) => ({ ...prevErrors, reason: "Please select a reason for decline." }));
      valid = false;
    }
    if (!comments) {
      setErrors((prevErrors) => ({ ...prevErrors, comments: "Please provide additional comments." }));
      valid = false;
    }
    if (!valid) return;

    onConfirm(reason, comments);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full mx-auto shadow-lg">
        <button
          className="absolute top-0 right-0 mt-2 mr-2 text-black hover:text-red-600 focus:outline-none"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">Decline Driver</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="reason">
            Reason for Decline:
          </label>
          <select
            id="reason"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, reason: "" }));
            }}
          >
            <option value="">Select a reason</option>
            <option value="Incomplete Documents">Incomplete Documents</option>
            <option value="Invalid Information">Invalid Information</option>
            <option value="Other">Other</option>
          </select>
          {errors.reason && <p className="text-red-600 text-sm mt-1">{errors.reason}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="comments">
            Additional Comments:
          </label>
          <textarea
            id="comments"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            rows="4"
            value={comments}
            onChange={(e) => {
              setComments(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, comments: "" }));
            }}
          ></textarea>
          {errors.comments && <p className="text-red-600 text-sm mt-1">{errors.comments}</p>}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineModal;
