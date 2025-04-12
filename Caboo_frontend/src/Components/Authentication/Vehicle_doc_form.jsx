import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import mainImage from "../../assets/mainimage.webp";
import { useSelector } from "react-redux";
import useAuthentication from "../../Hooks/useAuthentication";
import { driver_signup_url } from "../../Utils/Constanse";

const Vehicle_doc_form = () => {
  const driver = useSelector((state) => state.driver_data.driver_data);
  const role = useSelector((state) => state.Authentication.role);
  const { DriverCreation } = useAuthentication();

  const initialValues = {
    aadhaar: "",
    vehicle_name: "",
    vehicle_no: "",
    phone: driver.phone || "",
    rc_img: null,
    license: null,
    insurance: null,
    vehicle_Photo: null,
    profile: null,
    Vehicle_type: "",
  };

  const validationSchema = Yup.object().shape({
    aadhaar: Yup.string()
      .matches(/^\d{12}$/, "Aadhaar number must be exactly 12 digits")
      .required("Required"),

    vehicle_name: Yup.string()
      .trim()
      .matches(/^[a-zA-Z0-9 ]+$/, "Vehicle name cannot contain symbols")
      .required("Required"),

    vehicle_no: Yup.string()
      .matches(
        /^[A-Za-z]{2}\d{2}[A-Za-z]{1,2}\d{1,4}$/,
        "Vehicle number must be in format ( KA03MN1234 )"
      )
      .matches(/^\S.*$/, "Vehicle number cannot start with a space")
      .required("Required"),

    phone: Yup.string()
      .trim()
      .matches(
        /^(?!.*(\d)\1{9})\d{10}$/,
        "Phone number must be 10 digits and cannot have all the same digits"
      )
      .required("Phone number is required"),

    rc_img: Yup.mixed()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png"].includes(value.type);
      })
      .required("RC Document is required"),

    license: Yup.mixed()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png"].includes(value.type);
      })
      .required("License is required"),

    insurance: Yup.mixed()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png"].includes(value.type);
      })
      .required("Insurance is required"),

    vehicle_Photo: Yup.mixed()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png"].includes(value.type);
      })
      .required("Vehicle Photo is required"),

    profile: Yup.mixed()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png"].includes(value.type);
      })
      .required("Profile Photo is required"),

    Vehicle_type: Yup.string().required("Vehicle type is required"),
  });

  const onSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const updatedDriver = { ...driver };
      if (values.phone && !driver.phone) {
        updatedDriver.phone = values.phone;
      }
      
      const submitData = {
        ...values,
        role: role,
        customuser: updatedDriver
      };
      
      console.log("Submitting data:", submitData);
      await DriverCreation(submitData, driver_signup_url);
    } catch (error) {
      console.error("Submit error:", error);
      setStatus({ error: "Failed to submit form. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col mt-20">
      <div className="container mx-auto flex-grow flex flex-col md:flex-row">
        <div className="hidden h-screen md:flex md:w-1/2 items-center justify-center">
          <img className="h-[450px]" src={mainImage} alt="Main" />
        </div>
        <div className="w-full md:w-1/2 flex justify-center bg-black text-white p-6">
          <div className="flex-grow flex flex-col items-center md:items-start justify-center text-white">
            <span className="font-bold text-2xl flex items-center mb-6">
              Vehicle Documents
            </span>
            <div className="w-full max-w-2xl text-lg font-bold relative">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ setFieldValue, values, isSubmitting, status }) => (
                  <Form className="space-y-6">
                    {status && status.error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {status.error}
                      </div>
                    )}

                    <div className="flex flex-wrap -mx-2">
                      <div className="w-full md:w-1/2 px-2 mb-4">
                        <Field
                          type="text"
                          id="aadhaar"
                          name="aadhaar"
                          placeholder="Aadhaar Number"
                          className="w-full p-2 bg-gray-200 rounded-md text-black"
                        />
                        <ErrorMessage
                          name="aadhaar"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="w-full md:w-1/2 px-2 mb-4">
                        <Field
                          type="text"
                          id="vehicle_name"
                          name="vehicle_name"
                          placeholder="Vehicle Name"
                          className="w-full p-2 bg-gray-200 rounded-md text-black"
                        />
                        <ErrorMessage
                          name="vehicle_name"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-2">
                      <div className="w-full md:w-1/2 px-2 mb-4">
                        <Field
                          type="text"
                          id="vehicle_no"
                          name="vehicle_no"
                          placeholder="Vehicle Number"
                          className="w-full p-2 bg-gray-200 rounded-md text-black"
                        />
                        <ErrorMessage
                          name="vehicle_no"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="w-full md:w-1/2 px-2 mb-4">
                        {!driver.phone && (
                          <>
                            <Field
                              type="number"
                              id="phone"
                              name="phone"
                              placeholder="Phone"
                              className="w-full p-2 bg-gray-200 rounded-md text-black"
                            />
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="w-full mb-4">
                      <Field
                        as="select"
                        name="Vehicle_type"
                        className="w-full p-2 bg-gray-200 rounded-md text-black"
                      >
                        <option value="" disabled>
                          Select Vehicle Type
                        </option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Auto">Auto</option>
                      </Field>
                      <ErrorMessage
                        name="Vehicle_type"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="w-full space-y-4">
                      {[
                        { name: "rc_img", label: "RC Document" },
                        { name: "license", label: "License" },
                        { name: "insurance", label: "Insurance" },
                        { name: "vehicle_Photo", label: "Vehicle Photo" },
                        { name: "profile", label: "Profile Photo" }
                      ].map(({ name, label }) => (
                        <div key={name} className="mb-4">
                          <label className="block text-sm font-medium text-gray-500 mb-2">
                            {label}
                          </label>
                          <input
                            type="file"
                            name={name}
                            accept="image/*"
                            onChange={(event) => {
                              setFieldValue(name, event.currentTarget.files[0]);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md text-white"
                          />
                          {values[name] && (
                            <img
                              src={URL.createObjectURL(values[name])}
                              alt={`${label} Preview`}
                              className="mt-2 h-32 w-40 object-fit rounded-lg"
                            />
                          )}
                          <ErrorMessage
                            name={name}
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-20 py-2 bg-white text-black rounded-md hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-all duration-300"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>

                    {isSubmitting && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicle_doc_form;