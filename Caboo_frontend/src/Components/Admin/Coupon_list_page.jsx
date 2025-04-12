import React, { useEffect, useState } from "react";
import useAdmin from "../../Hooks/useAdmin";
import { useSelector } from "react-redux";
import Coupon_edit from "./Coupon_edit";

const Coupon_list_page = () => {
    const [currentcoupons,setcurrentcoupons]=useState()
    const [showskelton,setSkelton] = useState(true)
    const [EditCoupon,setEditCoupon]=useState(null)

    const { Get_Coupon }=useAdmin()
    const coupon = useSelector((state)=>state.admin_data.coupons)

    useEffect(()=>{
        setcurrentcoupons(coupon?coupon:{})

    },[coupon])

    useEffect(()=>{
        setTimeout(() => {
            setSkelton(false)

        }, 1000);
       
        Get_Coupon()
    },[])

    const handleCoupon=(value)=>{
        setEditCoupon(value)
       }

  return (
    <div>
      <div className=" bg-white rounded-lg ">
        { EditCoupon ? <div className="flex justify-center"><Coupon_edit coupondata={EditCoupon} EditCoupon={setEditCoupon} /></div> :(
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                No
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Coupon Code
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Coupon Type
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Discount/ <br /> Percentage
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Max Amount
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Start Date
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Expire Date
              </th>
             
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Status
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {showskelton ?(
              <tr>
                <td colSpan="7" className="py-2  px-4 text-center">
                  <div>
                    <div className="animate-pulse flex flex-col items-center mt-10  gap-4 w-full">
                      {" "}
                      <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                      <div className="h-7 bg-slate-400 w-full rounded-md"></div>

                      <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
                      <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
                      <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                      <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ):
            
            currentcoupons && currentcoupons.length > 0 ? (
              currentcoupons.map((data, index) => (
                <tr
                  key={data.id}
                  className="relative hover:bg-gray-200 font-bold transition-colors"
                >
                  <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                  <td className="py-3 px-4">{data.code}</td>
                  <td className="py-3 px-4">{data.type}</td>
                  <td className="py-3 px-4">{data.discount}%</td>
                  <td className="py-3 px-4">₹ {data.max_amount}</td>
                  <td className="py-3 px-4">{new Date(data.start_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{new Date(data.end_date).toLocaleDateString()}</td>
                  <td className={`py-3 px-4 ${data.status ? 'text-green-600':'text-orange-600'}`}>{data.status ? 'Active' : 'Inactive'}</td>

                  <td className="py-3">
                
                    <button onClick={()=>handleCoupon(data)} className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : ( <tr>
                <td colSpan="9" className="py-4 px-4 text-2xl font-bold  text-center">
                  No data available
                </td>
              </tr>)}
          </tbody>
        </table>
        )}
        {/* <div className="flex   justify-center space-x-3 my-5">
          <button
            disabled={page === 1}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Previous page"
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-medium">
            {page}
          </span>

          {page < total_pages - 1 && (
            <>
              <span className="text-gray-500 font-bold">. . .</span>
              <span className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-medium">
                {total_pages}
              </span>
            </>
          )}

          <button
            disabled={page === total_pages}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Next page"
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Coupon_list_page;
