import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Landing_Form from "../Components/LandingPage_layer1";
import LandingPage_layer2 from "../Components/LandingPage_layer2";

const LandingPage = () => {
  const headprops={
     ride:true,
     drive:true,
    user:false

  }
  return (
    <div id="/main">
      <>
         
      <Header headprops={headprops} />

      </>
      <div className="bg-black  flex">
        <Landing_Form />
      </div>

      <div>
        <LandingPage_layer2 />
      </div>
      <>
      <Footer />
      </>
    </div>
  );
};

export default LandingPage;
