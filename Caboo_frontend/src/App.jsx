import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { appStore, persist } from "./Redux/Store";

import PrivatRoute from "./PrivatRoute";
import PrivatRoute_user from "./PrivatRoute_user";
import AdminPrivatRoute from "./AdminPrivatRoute";
import Driver_PrivatRoute from "./Driver_PrivatRoute";

import { WebSocketProvider } from "./Socket/UserChatSocker.jsx";
import { DriverWebSocketProvider } from "./Socket/DriverChatSocket.jsx";

import LandingPage from "./Pages/LandingPage";
import Signin_selection from "./Pages/Signin_selection";
import Admin_Signin from "./Pages/Authentication/Admin_Signin";
import "./App.css";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import ErrorPage from "./Components/ErrorPage.jsx";
import Spinner from "./Components/Spinner.jsx";

const Signup = lazy(() => import("./Pages/Authentication/Signup"));
const OtpForm = lazy(() => import("./Components/Authentication/OtpFrom"));
const Vehicle_doc = lazy(() => import("./Pages/Authentication/Vehicle_doc"));
const WaitingModal = lazy(() => import("./Components/Driver/WaitingModal"));

const UserMain = lazy(()=> import("./Pages/user_side/UserMain.jsx"));
const UserHome = lazy(() => import("./Components/user_side/UserHome_main.jsx"));
const UserProfile = lazy(() => import("./Components/user_side/UserProfile_main.jsx"));
const UserRide = lazy(() => import("./Pages/user_side/userRide"));
const PaymentModal = lazy(() => import("./Components/user_side/PaymentModal"));
const RideDetails = lazy(() => import("./Components/user_side/RideDetails"));
const Confirmation = lazy(() => import("./Components/user_side/Confirmation"));
const User_header = lazy(() => import("./Components/user_side/User_header"));
const UserWallet = lazy(()=> import("./Components/user_side/UserWallet"));


const Admin_home = lazy(() => import("./Pages/Admin/Admin_home"));
const Documents = lazy(() => import("./Pages/Admin/Documents"));
const TripListing = lazy(() => import("./Components/Admin/TripListing"));
const TripMore = lazy(() => import("./Components/Admin/TripMore"));
const Coupons = lazy(() => import("./Components/Admin/Coupons"));

const DriverMain = lazy(()=> import("./Pages/Driver/DriverMain.jsx"))
const Driver_home = lazy(() => import("./Pages/Driver/Driver_home"));
const Driver_profile = lazy(() => import("./Pages/Driver/Driver_profile"));
const Ride = lazy(() => import("./Pages/Driver/Ride"));
const PaymentConfirmModal = lazy(() => import("./Components/Driver/PaymentConfirmModal"));
const Tripdetails = lazy(() => import("./Components/Driver/Tripdetails"));
const Driver_Header = lazy(() => import("./Components/Driver/Driver_Header"));

const App = () => {
  return (
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persist}>
        <BrowserRouter>
          <Toaster position="bottom-center" richColors />
          <WebSocketProvider>
            <DriverWebSocketProvider>
              <Suspense fallback={<Spinner />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signin_selection" element={<Signin_selection />} />
                  <Route path="/admin" element={<Admin_Signin />} />

                  {/* Auth Related */}
                  <Route path="/signup" element={<PrivatRoute><Signup /></PrivatRoute>} />
                  <Route path="/otpverification" element={<OtpForm />} />
                  <Route path="/vehicle_doc" element={<Vehicle_doc />} />
                  <Route path="/waitingModal" element={<WaitingModal />} />

                  {/* User Routes */}
                  <Route path="/userhome" element={<PrivatRoute_user><UserMain/></PrivatRoute_user>} >
                    <Route index element={<UserHome />} />
                    <Route path="/userhome/userprofile" element={<UserProfile />} />
                    <Route path="/userhome/userRide" element={<UserRide />} />
                    <Route path="/userhome/paymentModal" element={<PaymentModal />} />
                    <Route path="/userhome/ridedetails" element={<RideDetails />} />
                    <Route path="/userhome/confirmation" element={<Confirmation />} />
                    <Route path="/userhome/userheader" element={<User_header />} />
                    <Route path="/userhome/userwallet" element={<UserWallet />} />

                  </Route>
                  {/* Admin Routes */}
                  <Route path="/admin_home" element={<AdminPrivatRoute><Admin_home /></AdminPrivatRoute>} />
                  <Route path="/Documents" element={<AdminPrivatRoute><Documents /></AdminPrivatRoute>} />
                  <Route path="/triplisting" element={<AdminPrivatRoute><TripListing /></AdminPrivatRoute>} />
                  <Route path="/tripmore" element={<AdminPrivatRoute><TripMore /></AdminPrivatRoute>} />
                  <Route path="/coupons" element={<AdminPrivatRoute><Coupons /></AdminPrivatRoute>} />

                  {/* Driver Routes */}
                  <Route path="/driver_home" element={<Driver_PrivatRoute><DriverMain /></Driver_PrivatRoute>} >
                  <Route index element={<Driver_home />} />
                  <Route path="/driver_home/driver_profile" element={<Driver_PrivatRoute><Driver_profile /></Driver_PrivatRoute>} />
                  <Route path="/driver_home/ride" element={<Driver_PrivatRoute><Ride /></Driver_PrivatRoute>} />
                  <Route path="/driver_home/paymentconfirm" element={<Driver_PrivatRoute><PaymentConfirmModal /></Driver_PrivatRoute>} />
                  <Route path="/driver_home/tripdetails" element={<Driver_PrivatRoute><Tripdetails /></Driver_PrivatRoute>} />
                  <Route path="/driver_home/driver_header" element={<Driver_PrivatRoute><Driver_Header /></Driver_PrivatRoute>} />
                  </Route>

                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </Suspense>
            </DriverWebSocketProvider>
          </WebSocketProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
