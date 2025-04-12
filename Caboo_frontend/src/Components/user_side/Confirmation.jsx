import { ErrorMessage, replace } from "formik";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import useGetUser from "../../Hooks/useGetUser";
import { Reviw_add_url } from "../../Utils/Constanse";

const Confirmation = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [review, setReview] = useState(""); 
  const navigate = useNavigate()
  const {ReviewManagement}=useGetUser()
  const {state} =useLocation() 
  const {trip_id} = state || {}
  console.log(trip_id,'trip_id')
  const handleSubmit = () => {
    console.log(rating,'rating')
    console.log(review,'review')
    if (rating > 0 || review.trim()) {
        const data={
             rating : rating,
             message : review,
             tripId : trip_id
        }
      ReviewManagement(Reviw_add_url,data,data)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black text-white rounded-lg shadow-xl max-w-3xl w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-500">Your payment has been successful !</h2>
        <p className="mb-6 text-center">
          We hope you had a pleasant trip! Please take a moment to rate your
          experience and leave feedback.
        </p>

        {/* Star Rating */}
        <div className="mb-6 text-center">
          <h3 className="font-bold mb-2">Rate Your Trip</h3>
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    className="hidden"
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    size={40}
                    className={`cursor-pointer ${
                      ratingValue <= (hover || rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>
          <p className="mt-2">
            {rating > 0 ? `You rated ${rating} stars` : "Please select a rating."}
          </p>
        </div>

        {/* Comment field */}
        <div className="mb-6">
          <label htmlFor="review" className="block font-bold mb-2">
            Leave a comment
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us about your experience..."
            className="w-full border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>


        <div className="flex space-x-4 justify-end">
          <button
            className="bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition duration-200"
            onClick={()=>navigate('/userhome',{replace:true})}
          >
            Skip
          </button>
          <button
            className={`${
              rating > 0 || review.trim() ? "bg-white" : "bg-gray-500 disabled text-white :" 
            } text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition duration-200`}
            onClick={handleSubmit}
            disabled={rating === 0 && !review.trim()} 
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
