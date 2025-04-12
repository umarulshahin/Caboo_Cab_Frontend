// Signin_form.js
import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { email_validate_url } from "../../Utils/Constanse";
import { json, useNavigate } from "react-router-dom";
import useAuthentication from "../../Hooks/useAuthentication";
import { useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Signin_form = () => {
  const { Emailvalidation,GoogleAuth } = useAuthentication();

  const role = useSelector((state) => state.Authentication.role);
  const Navigate = useNavigate();
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const onSubmit = (values) => {
    values["role"] = role;
    Emailvalidation(values, email_validate_url);
  };

  const handleGoogleAuth=(response)=>{
   
    const value = jwtDecode(response.credential)
    const data = {
      email : value['email'],
    }
    onSubmit(data)
  }

  return (
    <div className=" bg-white h-80 text-black flex flex-col justify-center items-center">
      <div className="">
        <span className=" text-2xl font-bold pr-16">What's your Email?</span>
      </div>
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="my-4 relative w-full text-lg font-bold">
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="mt-1 block w-72 py-2 px-4 border border-gray-300 rounded-md text-black"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="bg-yellow-500 w-72 text-black px-4 py-2 rounded-md font-bold"
              >
                Continue
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <div className="flex items-center justify-center mt-5 w-[270px]">
        <hr className="flex-grow border-t border-black" />
        <span className="text-black mx-2">or</span>
        <hr className="flex-grow border-t border-black" />
      </div>
      <div className="mt-5 w-full flex justify-center">

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            // console.log(credentialResponse);
            GoogleAuth(credentialResponse)

          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />

      </div>
    </div>
  );
};

export default Signin_form;
