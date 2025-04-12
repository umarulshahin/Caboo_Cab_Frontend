import React, { lazy, Suspense } from "react";
import LandingPage from "./Pages/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin_selection from "./Pages/Signin_selection";
import { appStore, persist } from "./Redux/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster, toast } from 'sonner'
import UserHome from "./Pages/user_side/UserHome";
import UserProfile from "./Pages/user_side/UserProfile";
import PrivatRoute from "./PrivatRoute";
import PrivatRoute_user from "./PrivatRoute_user";
// import Admin_home from "./Pages/Admin/Admin_home";
import "./App.css";
import WaitingModal from "./Components/Driver/WaitingModal";
import Documents from "./Pages/Admin/Documents";
import Signup from "./Pages/Authentication/Signup";
import OtpForm from "./Components/Authentication/OtpFrom";
import Vehicle_doc from "./Pages/Authentication/Vehicle_doc";
import AdminPrivatRoute from "./AdminPrivatRoute";
import Admin_Signin from "./Pages/Authentication/Admin_Signin";
import Driver_home from "./Pages/Driver/Driver_home";
import Driver_PrivatRoute from "./Driver_PrivatRoute";
import Driver_profile from "./Pages/Driver/Driver_profile";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import Ride from "./Pages/Driver/Ride";
import UserRide from "./Pages/user_side/userRide";
import PaymentModal from "./Components/user_side/PaymentModal";
import PaymentConfirmModal from "./Components/Driver/PaymentConfirmModal";
import TripListing from "./Components/Admin/TripListing";
import Tripdetails from "./Components/Driver/Tripdetails";
import RideDetails from "./Components/user_side/RideDetails";
import TripMore from "./Components/Admin/TripMore";
import Confirmation from "./Components/user_side/Confirmation";
import User_header from "./Components/user_side/User_header";
import { WebSocketProvider } from "./Socket/UserChatSocker.jsx";
import { DriverWebSocketProvider } from "./Socket/DriverChatSocket.jsx";
import Driver_Header from "./Components/Driver/Driver_Header.jsx";
import Coupons from "./Components/Admin/Coupons.jsx";

const Admin_home = lazy(()=>import('./Pages/Admin/Admin_home.jsx'))

const App = () => {


  return (
    <div>
      <Provider store={appStore}>
        <PersistGate loading={null} persistor={persist}>
          <BrowserRouter>
          <Toaster position="bottom-center" richColors/>
          <WebSocketProvider>
            <DriverWebSocketProvider>

            <Routes>

              <Route path="/" element={<LandingPage />} />
              <Route path="/signin_selection" element={<Signin_selection />} />
              <Route path="/signup" element={<PrivatRoute><Signup /></PrivatRoute>} />
              <Route path="/otpverification" element={<OtpForm />} />
              <Route path='/waitingModal' element={<WaitingModal /> } />
              <Route path='/vehicle_doc' element={<Vehicle_doc /> } />


              <Route path="/userhome" element={ <PrivatRoute_user><UserHome /></PrivatRoute_user> } />
              <Route path="/userprofile" element={ <PrivatRoute_user><UserProfile/></PrivatRoute_user>}/>
              <Route path="/userRide" element={<PrivatRoute_user><UserRide /></PrivatRoute_user>}/>
              <Route path="/paymentModal" element={<PrivatRoute_user><PaymentModal /></PrivatRoute_user>}/>
              <Route path="/ridedetails" element={<PrivatRoute_user><RideDetails/></PrivatRoute_user>}/>
              <Route path="/confirmation" element={<PrivatRoute_user><Confirmation /></PrivatRoute_user>}/>
              <Route path="/userheader" element={<PrivatRoute_user><User_header /></PrivatRoute_user>} />

              <Route path="/admin" element={<Admin_Signin />} />
              <Route path="/admin_home" element={<AdminPrivatRoute><Suspense fallback={<div>Loading ...</div>} ><Admin_home /></Suspense></AdminPrivatRoute>} />
              <Route path="/Documents" element={<AdminPrivatRoute><Documents /></AdminPrivatRoute>} />
              <Route path="/triplisting" element={<AdminPrivatRoute><TripListing /></AdminPrivatRoute>}/>
              <Route path="/tripmore" element={<AdminPrivatRoute><TripMore /></AdminPrivatRoute>}/>
              <Route path="/coupons" element={<AdminPrivatRoute><Coupons /></AdminPrivatRoute>}/>
            
              <Route path="/driver_home" element={<Driver_PrivatRoute><Driver_home /></ Driver_PrivatRoute>} />
              <Route path="/driver_profile" element={<Driver_PrivatRoute><Driver_profile /></Driver_PrivatRoute> } />
              <Route path="/ride" element={<Driver_PrivatRoute><Ride /></Driver_PrivatRoute>} />
              <Route path="/paymentconfirm" element={<Driver_PrivatRoute><PaymentConfirmModal /></Driver_PrivatRoute>} />
              <Route path="/tripdetails" element={<Driver_PrivatRoute><Tripdetails /></Driver_PrivatRoute>} />
              <Route path="/driver_header" element={<Driver_PrivatRoute><Driver_Header /></Driver_PrivatRoute>} />

            </Routes>
            </DriverWebSocketProvider>
            </WebSocketProvider>

          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
