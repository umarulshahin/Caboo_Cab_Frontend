import React from 'react';
import Driver_Header from '../../Components/Driver/Driver_Header';
import Footer from '../../Components/Footer';
import Driver_Profile_page from '../../Components/Driver/Driver_Profile_page';

const Driver_profile = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow">
        <Driver_Profile_page />
      </main>
 
    </div>
  );
}

export default Driver_profile;
