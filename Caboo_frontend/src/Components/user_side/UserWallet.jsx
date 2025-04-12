import React, { useEffect, useRef, useState } from "react";
import useGetUser from "../../Hooks/useGetUser";
import { useSelector } from "react-redux";
import { Walletdetails_url } from "../../Utils/Constanse";
import { ChevronLeft, ChevronRight } from "lucide-react";

const UserWallet = () => {
  const { showRazorpay, UserTabls } = useGetUser();
  const amountref = useRef(null);
  const userdata = useSelector((state) => state.user_data.user_data);
  const walletdata = useSelector((state) => state.user_data.walletdetails);
  console.log(userdata, "user data");

  const { wallet } = userdata[0];
  const wallet_details = walletdata ? walletdata.wallet_details : null
  const current_page = walletdata ? walletdata.current_page : 1
  const total_pages= walletdata ? walletdata.total_pages: 1
  console.log(total_pages,'total page')
  const [page ,setpage] = useState(parseInt(current_page ),1)


  const handleSubmit = (e) => {
    e.preventDefault();
    const value = {
      amount: amountref.current.value || 0,
      user: userdata,
    };
    showRazorpay(value);
    amountref.current.value = null;
  };

  useEffect(() => {
    const wallet_data = async () => {
      const id = userdata[0].id;
      await UserTabls(Walletdetails_url, { id: id, page: page }, "wallet");
    };
    wallet_data();
  }, [userdata,page]);

  return (
    <div className="flex flex-col items-center justify-center mt-32 overflow-x-hidden">
      <div className="w-screen px-14 ">
        {/* Wallet Section */}
        <div className="bg-green-600 h-40 rounded-t-lg flex w-full">
          <div className="flex flex-col justify-center items-center h-full w-1/3 space-y-2">
            <span className="text-4xl font-bold text-white">₹ {wallet}</span>
            <span className="text-2xl font-bold text-white">
              WALLET BALANCE
            </span>
          </div>
          <div className="w-2/3 flex flex-col justify-center items-end pr-10">
            <div className="space-y-4">
              <span className="text-white font-bold text-xl">
                Recharge your wallet
              </span>
              <form onSubmit={handleSubmit} className="flex space-x-6">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  ref={amountref}
                  className="px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                <button
                  type="submit"
                  className="text-green-600 bg-white border border-green-600 text-lg font-bold py-2 px-4 rounded-lg shadow-[0px_0px_20px_rgba(0,0,0,0.2)] hover:scale-105 transition-all duration-300"
                >
                  Add to Wallet
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className=" mt-4 flex justify-center  bg-white shadow-md">
          <table className=" w-screen table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-bold">
                  No
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-bold">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-bold">
                  Reason
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-bold">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-bold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {wallet_details ? (
                wallet_details.map((data, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-200 font-bold transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                    <td className="py-3 px-4">{data.created_at}</td>
                    <td className="py-3 px-4">{data.reason}</td>
                    <td
                      className={`py-3 px-4 ${
                        data.status === "add"
                          ? "text-green-600"
                          : "text-red-600"
                      } `}
                    >
                      {data.status === "add" ? " +" : "-"} {data.amount}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        data.status === "add"
                          ? "text-green-600"
                          : "text-red-600"
                      } `}
                    >
                      {data.status === "add" ? "Recharge" : "Payment"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-2 px-4 text-center">
                    <div className="animate-pulse flex flex-col items-center mt-10 gap-4 w-full">
                      <div className="w-48 h-6 bg-slate-400 rounded-md"></div>
                      <div className="w-28 h-4 bg-slate-400 mx-auto mt-3 rounded-md"></div>
                      <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                      <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                      <div className="h-7 bg-slate-400 w-full rounded-md"></div>
                      <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div></div>
        </div>
      </div>
      <div className="flex items-center space-x-3 my-5">
  {/* Previous Button */}
  <button
    disabled={page === 1}
    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    aria-label="Previous page"
    onClick={() => setpage(page - 1)}
  >
    <ChevronLeft className="h-5 w-5" />
  </button>

  {/* Current Page */}
  <span className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-medium">
    {page}
  </span>

  {/* Dots and Total Pages */}
  {page < total_pages - 1 && (
    <>
      <span className="text-gray-500 font-bold">. . .</span>
      <span className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-medium">
        {total_pages}
      </span>
    </>
  )}

  {/* Next Button */}
  <button
    disabled={page === total_pages}
    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    aria-label="Next page"
    onClick={() => setpage(page + 1)}
  >
    <ChevronRight className="h-5 w-5" />
  </button>
</div>

    </div>
  );
};

export default UserWallet;
