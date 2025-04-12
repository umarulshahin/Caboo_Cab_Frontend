import React from 'react';
import Footer from '../../Components/Footer';
import UserProfile_main from '../../Components/user_side/UserProfile_main';
import User_header from '../../Components/user_side/User_header';

const UserProfile = () => {


  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full z-50">
        <User_header />
      </div>
      <div className="bg-black min-h-screen pt-16"> {/* Added pt-16 for padding top */}
        <UserProfile_main />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default UserProfile;
