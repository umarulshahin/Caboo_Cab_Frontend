import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiFlag, FiMapPin } from "react-icons/fi";
import mainImage from "../assets/mainimage.webp";

const Landing_Form = () => {

  return (
    <div className="container mx-auto " id="first_layout">
      <div className="flex flex-col md:flex-row  ">
        <div className="w-full md:w-3/6 flex justify-center ">
          <div className="h-screen flex flex-col items-center md:items-start justify-center text-white px-6 md:pl-16">
            <span className="text-2xl font-bold text-center md:text-left">
              Always Ready To Assist, Anytime <br /> Anywhere With C<span className="text-yellow-500">a</span>boo
            </span>

            <div className="mt-10 w-full max-w-md" id="first_layout">
              <span className="font-bold text-center block md:text-left">Request a ride, hop in, and enjoy the journey.</span>
              <Formik>
                  <Form>
                    <div className="mb-4 relative w-full text-lg font-bold">
                      <Field
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Enter your location"
                        className="mt-1 block w-full p-2 border pl-14 border-gray-300 rounded-md shadow-md"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                    
                    </div>

                    <div className="mb-4 relative text-lg font-bold">
                      <Field
                        type="text"
                        id="destination"
                        name="destination"
                        placeholder="Enter your destination"
                        className="mt-1 block w-full p-2 pl-14 border border-gray-300 rounded-md shadow-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFlag className="text-gray-400" />
                      </div>
                     
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-black font-bold rounded-md"
                    >
                      See price
                    </button>
                  </Form>
              </Formik>
            </div>
          </div>
        </div>
        <div className="hidden md:flex md:w-3/6 items-center justify-start">
          <img className="h-[450px]" src={mainImage} alt="Main" />
        </div>
      </div>
    </div>
  );
};

export default Landing_Form;
