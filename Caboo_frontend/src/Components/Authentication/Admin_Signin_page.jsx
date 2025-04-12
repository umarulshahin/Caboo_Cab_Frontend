import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import mainImage from "../../assets/mainimage.webp";
import logo from "../../assets/Logo.png";
import useAuthentication from "../../Hooks/useAuthentication";
import { signin_urls } from "../../Utils/Constanse";

const Admin_signin_page = () => {
    const {Signin}=useAuthentication()
    const initialValues = {
      email: "",
      password: "",
    };
  
    const validationSchema = Yup.object().shape({

      email: Yup.string().email("Invalid email format").required("Email is required"),

      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
          
        ),

    });
  
    const onSubmit = (values) => {
      
      console.log(values)
      Signin(values,signin_urls,null,"admin");
  
    };
  
    return (
      <div className="bg-black min-h-screen">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-3/6 items-center justify-center">
              <img className="h-[450px]" src={mainImage} alt="Main" />
            </div>
            <div className="w-full md:w-3/6 flex justify-center bg-black h-screen text-white">
              <div className="h-screen flex flex-col items-center md:items-start justify-center text-white px-6 md:pl-16">
                <div className=" w-full flex justify-center items-center my-10">
                <img src={logo} alt="logo" className=" h-20" />

                </div>
                <span className="font-bold text-2xl flex items-center">
                  Admin Sign in 
                </span>
                <div className="mt-6 w-96 max-w-md text-lg font-bold relative ">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({ isSubmitting, setFieldValue }) => (
                      <Form>
                      
  
                        <div className="mb-4">
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-md text-black"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
  
                        <div className="mb-4">
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-md text-black"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                     
  
                        <div className="flex justify-center items-center">
                          <button
                            type="submit"
                            className="px-10 py-2 bg-white text-black font-bold rounded-md"
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
        </div>
      </div>
    );
}

export default Admin_signin_page