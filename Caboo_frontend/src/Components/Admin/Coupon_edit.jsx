import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { backendUrl } from '../../Utils/Constanse';
import useAdmin from '../../Hooks/useAdmin';
import { addCurrentPage } from '../../Redux/AdminSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Coupon_edit = ({ coupondata,EditCoupon }) => {
    const {Update_coupon}=useAdmin()
  
    useEffect(() => {
      formik.setFieldValue('startDate', new Date(coupondata.start_date).toISOString().substring(0, 10));
      formik.setFieldValue('expireDate', new Date(coupondata.end_date).toISOString().substring(0, 10));
    }, [coupondata]);

  const formik = useFormik({
    initialValues: {
      couponCode: coupondata.code,
      couponType: coupondata.type,
      discount: coupondata.discount,
      maxAmount: coupondata.max_amount,
      image: '',
      startDate: '',
      expireDate: '',
      isActive: coupondata.status,
    },
    validationSchema: Yup.object({
      couponCode: Yup.string()
        .matches(/^[A-Za-z0-9][^\s]*$/, 'Coupon code must start with a letter or number and must not contain spaces')
        .required('Coupon code is required'),
      couponType: Yup.string()
        .oneOf(['percentage', 'amount'], 'Invalid coupon type')
        .required('Coupon type is required'),
      discount: Yup.number()
        .typeError('Discount must be a number')
        .max(50, 'Discount cannot be more than 50%')
        .required('Discount amount/percentage is required'),
      maxAmount: Yup.number()
        .typeError('Max amount must be a number')
        .required('Maximum amount is required'),
      image: Yup.mixed(),
      startDate: Yup.date()
        .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Start date must be today or a future date')
        .required('Start date is required'),
      expireDate: Yup.date()
        .min(Yup.ref('startDate'), 'Expiry date cannot be before the start date')
        .required('Expiry date is required'),
    }),
    onSubmit: (values) => {
      values['id']=coupondata.id
      console.log('Form values:', values);

      Update_coupon(values)
    },
  });
  

  return (
    <div className="flex justify-end mt-10">
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
              disabled
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
            disabled
              id="couponType"
              name="couponType"
              className="bg-gray-200 py-2 px-6 my-2 border border-gray-400"
              value={formik.values.couponType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" label="Select coupon type" />
              <option value="percentage" label="Percentage" />
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
                formik.setFieldValue('image', event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
            />
            {/* Display image preview if available */}
            {formik.values.image && typeof formik.values.image === 'object' ? (
              <img
                src={ URL.createObjectURL(formik.values.image)}
                alt="Image Preview"
                className="mt-2 max-w-full h-200"
              />
            ) : (
              coupondata.image && (
                <img src={backendUrl+coupondata.image} alt="Existing Image" className="mt-2 max-w-full h-200" />
              )
            )}
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

        <div className="flex justify-center pt-10 space-x-4">
        <button
            type='button'
            onClick={()=>EditCoupon(false)}
            className=" hover:bg-gray-300 font-bold text-black border-2 border-black py-2 px-8 rounded-lg"
          >
            Cancel
          </button>
           <>
          <button
            type="submit"
            className="bg-black hover:bg-gray-300 text-white py-2 px-8 rounded-lg"
          >
            Update Coupon
          </button>
          </>
        </div>
      </form>
    </div>
  );
};

export default Coupon_edit;
