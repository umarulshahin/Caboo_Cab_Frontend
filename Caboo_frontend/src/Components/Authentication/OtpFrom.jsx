import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { email_validate_url, Otpverify_url } from '../../Utils/Constanse'; // Ensure you have the correct URL for resending OTP
import Cookies from "js-cookie";
import useAuthentication from '../../Hooks/useAuthentication';
import { Link, useNavigate } from 'react-router-dom';

const OtpForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [errormessage, seterrormessage] = useState('');
  const [timer, setTimer] = useState(30); // Timer for 30 seconds
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const inputRefs = useRef([]);
  const { Otp_verification, Emailvalidation } = useAuthentication();
  const email = useSelector((state) => state.Authentication.email);
  const role = useSelector((state) => state.Authentication.role);
  const navigate=useNavigate()

  useEffect(() => {
    const userToken = Cookies.get('userTokens');
    
    // Determine if the user or driver is already logged in
    console.log(userToken)
    if ( userToken) {
      navigate('/userhome');
    } 


    let interval;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsButtonDisabled(false);
            return 30; // Reset timer to 30 seconds
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus on next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input if backspace is pressed
    if (e.key === "Backspace" && !otp[index] && index !== 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      seterrormessage('OTP must be 6 digits long and all fields must be filled.');
      return;
    }
    seterrormessage('');

    const data = {
      otp: otpValue,
      email: email
    };
    Otp_verification(data, Otpverify_url, seterrormessage);
  };

  const handleResendOtp = () => {
     const data={
      email : email,
      role:role
     }
    Emailvalidation(data,email_validate_url);
    setTimer(30); 
    setIsButtonDisabled(true);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className='text-black flex flex-col items-center'>
        <span className='font-bold text-2xl'>OTP Verification</span>
        <br />
        <span className='pt-2'>One Time Password (OTP) has been sent via mail to 
        </span>
        <span className='pb-4'>{email}</span>
      </div>
      <div className="flex space-x-2">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={data}
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            className="w-14 h-12 border border-gray-400 text-center text-xl rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <span className='text-red-500 pt-2'>{errormessage ? errormessage : ""}</span>
      <button
        onClick={handleSubmit}
        className="mt-5 px-4 py-2 bg-black text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      >
        Verify OTP
      </button>
      <div className="mt-4">
         {
          isButtonDisabled ?
            <span className='text-gree' > Resend OTP in <span className='text-red-500'>{timer}</span> s</span>
                         :
             <a href="#" className='px-4 text-blue-500 ' onClick={handleResendOtp} > Resend OTP</a>
         }
      

      </div>
    </div>
  );
};

export default OtpForm;
