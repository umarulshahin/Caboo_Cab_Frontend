import React, { useEffect, useState } from 'react';
import Footer from '../../Components/Footer';
import UserHome_main from '../../Components/user_side/UserHome_main';
import useGetUser from '../../Hooks/useGetUser';
import { user_data_url } from '../../Utils/Constanse';
import User_header from '../../Components/user_side/User_header';
import useWebSocket from '../../Socket/Socket';
import UserProfile_main from '../../Components/user_side/UserProfile_main';
import UserWallet from '../../Components/user_side/UserWallet';
const UserHome = () => {
  const { Get_data } = useGetUser();

  useEffect(() => {
    Get_data(user_data_url);
  }, []);
  const [status, setStatus] = useState(localStorage.getItem('status')||'');
  
  useEffect(()=>{
      localStorage.setItem('status',status)
  },[status])
  const renderComponent = () => {
      console.log('uesr working wokring')
      switch (status) {
          case 'home':
            return <UserHome_main />
          case '':
            return <UserHome_main />
          case 'profile':
              return <UserProfile_main />;
          case 'wallet':
              return <UserWallet />;
        
          default:
              return null; 
      }
  };
  console.log(status,'user home page')

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <User_header setStatus={setStatus} />
      </header>
      <main className="flex-grow flex justify-center items-center">
        {renderComponent()}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default UserHome;
