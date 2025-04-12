import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAdmin from "../../Hooks/useAdmin";
import { CouponManage_url } from "../../Utils/Constanse";
import Coupon_list_page from "./Coupon_list_page";


const Coupons = () => {

  const { CouponManage}=useAdmin()
  const [showform,setShowform]=useState(false)
  const formik = useFormik({
    initialValues: {
      couponCode: "",
      couponType: "",
      discount: "",
      maxAmount: "",
      image: null,
      startDate: "",
      expireDate: "",
      isActive: false,
    },
    validationSchema: Yup.object({
      // Coupon code: start with a number or string and no spaces allowed
      couponCode: Yup.string()
        .matches(
          /^[A-Za-z0-9][^\s]*$/,
          "Coupon code must start with a letter or number and must not contain spaces"
        )
        .required("Coupon code is required"),

      // Coupon type: must be one of the selected options
      couponType: Yup.string()
        .oneOf(["percentage", "amount"], "Invalid coupon type") // Add your available options here
        .required("Coupon type is required"),

      // Discount: must be a number and less than or equal to 50%
      discount: Yup.number()
        .typeError("Discount must be a number")
        .max(50, "Discount cannot be more than 50%")
        .required("Discount amount/percentage is required"),

      // Max Amount: must be less than or equal to 50
      maxAmount: Yup.number()
        .typeError("Max amount must be a number")
        .required("Maximum amount is required"),

      // Image: must be provided
      image: Yup.mixed().required("Image is required"),

      // Start date: must be today or in the future
      startDate: Yup.date()
        .min( new Date(new Date().setHours(0, 0, 0, 0)), "Start date must be today or a future date")
        .required("Start date is required"),

      // Expire date: must be after the start date
      expireDate: Yup.date()
        .min(
          Yup.ref("startDate"),
          "Expiry date cannot be before the start date"
        )
        .required("Expiry date is required"),
    }),
    onSubmit: (values) => {
      // Handle form submission logic here
      console.log("Form values:", values);

     CouponManage(CouponManage_url,values)
    },
  });
 

  return (
    <div className="p-10">
      <h1 className="text-3xl text-black font-bold mb-5">Coupons Management</h1>
      <div className="flex justify-end  mt-10">
        <button onClick={()=>setShowform(!showform)} className="bg-black text-white py-3 px-4 rounded-lg hover:text-black hover:bg-gray-300 font-semibold">{ showform ? 'View coupons': 'Create New Coupon'}</button>
      </div>
      {showform ? (
      <form onSubmit={formik.handleSubmit}>
        {/* First Line: Coupon Code and Coupon Type */}
        <div className="flex justify-evenly pt-10 w-full space-x-10">
          <div className="flex flex-col w-1/2">
            <label htmlFor="couponCode" className="font-semibold">
              Coupon Code <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="couponCode"
              name="couponCode"
              className="bg-gray-200 py-2 px-6 my-2 border border-gray-400"
              value={formik.values.couponCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.couponCode && formik.errors.couponCode ? (
              <p className="text-red-600">{formik.errors.couponCode}</p>
            ) : null}
          </div>

          <div className="flex flex-col w-1/2">
            <label htmlFor="couponType" className="font-semibold">
              Coupon Type <span className="text-red-600">*</span>
            </label>
            <select
              id="couponType"
              name="couponType"
              className="bg-gray-200 py-2 px-6 my-2 border border-gray-400"
              value={formik.values.couponType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" label="Select coupon type" />
              <option value="percentage" label="Percentage" />
              {/* <option value="amount" label="Amount" /> */}
            </select>
            {formik.touched.couponType && formik.errors.couponType ? (
              <p className="text-red-600">{formik.errors.couponType}</p>
            ) : null}
          </div>
        </div>

        {/* Second Line: Discount, Max Amount, and Image */}
        <div className="flex justify-evenly pt-10 w-full space-x-10">
          <div className="flex flex-col w-1/3">
            <label htmlFor="discount" className="font-semibold">
              Discount Amount/Percentage <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="discount"
              name="discount"
              className="bg-gray-200 py-2 px-6 my-2 border border-gray-400"
              value={formik.values.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.discount && formik.errors.discount ? (
              <p className="text-red-600">{formik.errors.discount}</p>
            ) : null}
          </div>

          <div className="flex flex-col w-1/3">
            <label htmlFor="maxAmount" className="font-semibold">
              Maximum Amount <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="maxAmount"
              name="maxAmount"
              className="bg-gray-200 py-2 px-6 my-2 border border-gray-400"
              value={formik.values.maxAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.maxAmount && formik.errors.maxAmount ? (
              <p className="text-red-600">{formik.errors.maxAmount}</p>
            ) : null}
          </div>

          <div className="flex flex-col w-1/3">
            <label htmlFor="image" className="font-semibold">
              Image <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="bg-gray-200 py-2 px-6 my-2 border border-gray-400"
              onChange={(event) => {
                formik.setFieldValue("image", event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.image && formik.errors.image ? (
              <p className="text-red-600">{formik.errors.image}</p>
            ) : null}
          </div>
        </div>

        {/* Third Line: Start Date, Expiry Date, and Toggle */}
        <div className="flex justify-evenly pt-10 w-full space-x-10">
          <div className="flex flex-col w-1/3">
            <label htmlFor="startDate" className="font-semibold">
              Start Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="bg-gray-200 py-2 px-6 my-2 border border-gray-400"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.startDate && formik.errors.startDate ? (
              <p className="text-red-600">{formik.errors.startDate}</p>
            ) : null}
          </div>

          <div className="flex flex-col w-1/3">
            <label htmlFor="expireDate" className="font-semibold">
              Expiry Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="expireDate"
              name="expireDate"
              className="bg-gray-200 py-2 px-6 my-2 border border-gray-400"
              value={formik.values.expireDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.expireDate && formik.errors.expireDate ? (
              <p className="text-red-600">{formik.errors.expireDate}</p>
            ) : null}
          </div>

          <div className="flex flex-col w-1/3">
            <label htmlFor="isActive" className="font-semibold">
              Activate Coupon
            </label>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              className="my-2 h-6 w-6"
              checked={formik.values.isActive}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-10">
          <button
            type="submit"
            className="bg-black text-white py-2 px-10 rounded-full font-bold hover:bg-gray-800"
          >
            Create 
          </button>
        </div>
      </form>):(<div className="mt-7"> <Coupon_list_page /></div> )}
    </div>
  );
};

export default Coupons;
