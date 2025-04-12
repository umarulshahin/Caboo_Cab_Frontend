import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import mainImage from "../../assets/mainimage.webp";
import { user_signup_url } from "../../Utils/Constanse";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuthentication from "../../Hooks/useAuthentication";

const Signup_page = () => {
  const navigate = useNavigate();
  const { Signup_validation } = useAuthentication();

  const user = useSelector((state) => state.Authentication.email);
  const role = useSelector((state) => state.Authentication.role);

  const initialValues = {
    username: "",
    lastname: "",
    phone: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Full Name is required")
      .matches(
        /^[a-zA-Z][a-zA-Z\s]*$/,
        "Full Name must start with a letter and contain only letters and spaces"
      ),
    lastname: Yup.string()
      .required("Last Name is required")
      .matches(
        /^[a-zA-Z][a-zA-Z\s]*$/,
        "Last Name must start with a letter and contain only letters and spaces"
      ),
    phone: Yup.string()
      .trim()
      .matches(
        /^(?!.*(\d)\1{9})\d{10}$/,
        "Phone number must be 10 digits and cannot have all the same digits"
      )
      .required("Phone number is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  });

  const onSubmit = (values) => {
    values["email"] = user;
    values["role"] = role;
    Signup_validation(values, user_signup_url);
  };

  return (
    <div className="bg-black min-h-screen flex mt-10 items-center justify-center">
      <div className="container mx-auto flex flex-col  md:flex-row">
        <div className="hidden md:flex md:w-3/6 items-center justify-center">
          <img className="h-[450px]" src={mainImage} alt="Main" />
        </div>

        {/* Form Container with Border and Background */}
        <div className="w-full md:w-3/6  flex justify-center">
          <div className="bg-transparent  border border-gray-800 rounded-xl shadow-xl p-10 h-auto md:h-[550px] w-full max-w-lg flex flex-col justify-center">
            <h2 className="text-2xl text-white font-bold  mb-8">
              Create an account
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, isSubmitting }) => (
                <Form>
                  <div className="relative mb-6">
                    <Field
                      type="text"
                      id="username"
                      name="username"
                      required
                      className="peer block  w-full font-semibold  p-4 bg-gray-200 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2  text-black transition-transform duration-300 transform hover:scale-105"
                    />
                    <span
                      className={`absolute  font-semibold left-0 top-1 px-4 text-gray-700 transition-transform duration-300 transform ${
                        values.username
                          ? "translate-y-[-0.5rem] scale-75"
                          : "translate-y-2 scale-100"
                      } origin-left pointer-events-none`}
                    >
                      Full Name
                    </span>
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="relative mb-6">
                    <Field
                      type="text"
                      id="lastname"
                      name="lastname"
                      required
                      className="peer block w-full font-semibold  p-4 bg-gray-200 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2  text-black transition-transform duration-300 transform hover:scale-105"
                    />
                    <span
                      className={`absolute font-semibold left-0 top-1 px-4 text-gray-700 transition-transform duration-300 transform ${
                        values.lastname
                          ? "translate-y-[-0.5rem] scale-75"
                          : "translate-y-2 scale-100"
                      } origin-left pointer-events-none`}
                    >
                      Last Name
                    </span>
                    <ErrorMessage
                      name="lastname"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="relative mb-6">
                    <Field
                      type="text"
                      id="phone"
                      name="phone"
                      required
                      className="peer  block w-full p-4 font-semibold bg-gray-200 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2  text-black transition-transform duration-300 transform hover:scale-105"
                    />
                    <span
                      className={`absolute font-semibold left-0 top-1 px-4 text-gray-700 transition-transform duration-300 transform ${
                        values.phone
                          ? "translate-y-[-0.5rem] scale-75"
                          : "translate-y-2 scale-100"
                      } origin-left pointer-events-none`}
                    >
                      Phone
                    </span>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="relative mb-6">
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      required
                      className="peer block w-full p-4 font-semibold bg-gray-200 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2  text-black transition-transform duration-300 transform hover:scale-105"
                    />
                    <span
                      className={`absolute font-semibold left-0 top-1 px-4 text-gray-700 transition-transform duration-300 transform ${
                        values.password
                          ? "translate-y-[-0.5rem] scale-75"
                          : "translate-y-2 scale-100"
                      } origin-left pointer-events-none`}
                    >
                      Password
                    </span>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-center items-center mt-8">
                    <button
                      type="submit"
                      className="px-10 py-2 bg-white text-black font-bold rounded-md transition-all duration-200 transform hover:scale-105"
                    >
                      Continue
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup_page;
