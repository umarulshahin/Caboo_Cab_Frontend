import React from 'react'
import Footer from '../../Components/Footer'
import Header from '../../Components/Header';
import Vehicle_doc_form from '../../Components/Authentication/Vehicle_doc_form';

const Vehicle_doc = () => {
    const headprops = {
        ride: false,
        drive: false,
        user: true,
      };
  return (
    
    <div className="flex flex-col min-h-screen">
    <Header headprops={headprops} />
    <div className="flex-grow">
      <Vehicle_doc_form />
    </div>
    <Footer />
  </div>
  )
}

export default Vehicle_doc