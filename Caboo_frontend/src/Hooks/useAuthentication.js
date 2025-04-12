import { toast } from 'sonner';
import { addDriver_status, addemail, addrole, addUser_status } from '../Redux/AuthenticationSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { json, useNavigate } from 'react-router-dom';
import { admin_data_url, Driver_data_urls, GoogleAuth_url, signin_urls, user_data_url } from '../Utils/Constanse';

import { addadmin_token } from '../Redux/AdminSlice';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import useGetUser from './useGetUser';
import { addToken_data } from '../Redux/UserSlice';
import { addDriver_data, addDriver_token } from '../Redux/DriverSlice';

const useAuthentication = () => {
      
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const role = useSelector((state)=>state.Authentication.role)
    const user_status =useSelector((state)=>state.Authentication.user_status)
    const email = useSelector((state)=>state.Authentication.email)
    const driver_status = useSelector((state)=>state.Authentication.driver_status)
    const {Get_data}=useGetUser()

        // Email validation Api Call

    const Emailvalidation= async(values,urls)=>{

        try{
            const response = await axios.post(urls,values,{
                headers:{
                    "Content-Type":"application/json",
                }
            });

            if(response.status===200){
                console.log(response.data.success, "email validation");

                const successMessage = response.data.success.trim().toLowerCase();

                if (successMessage === "alredy email exist") {
                  
                    console.log(response.data.email,"Handling 'alredy email exist'");

                    if(response.data.status==='Driver not approval'){
                        navigate("/waitingModal")
                        
                    }else{

                        dispatch(addUser_status(response.data.success));
                        dispatch(addemail(response.data.email));
                        dispatch(addDriver_status(response.data.status));
                        dispatch(addDriver_data(response.data.data));
                        console.log(role)
                        if(role==='Drive'){
                            navigate('/signin_selection', { state: { modal: 'OTP Driver' } });

                        }else{
                            navigate('/signin_selection', { state: { modal: 'OTP verify' } });

                        }
                    }
                   

                } else if (successMessage === "new user") {

                    dispatch(addUser_status(response.data.success));
                    dispatch(addemail(response.data.email));
                    if(role==='Drive'){
                        navigate('/signin_selection', { state: { modal: 'OTP Driver' } });

                    }else{
                        navigate('/signin_selection', { state: { modal: 'OTP verify' } });

                    }

                } else if (successMessage === "user is not active") {
                    toast.warning("Your account is blocked");

                } else {
                    console.log("No matching condition found for:", successMessage);
                }

                console.log(response.data.success, "yes outside");
            }
        }catch(error){

          console.error(error,"Modalform error")
        }
       
    }

            // OTP verification api call

    const Otp_verification=async(values,urls,seterrormessage)=>{

        try{
            const response= await axios.post(urls,values,{
                headers:{
                    'Content-Type':'application/json'
                }
            });

            if(response.status===200){

                if(response.data.success){
                    
                    if(user_status==='New user'){

                        navigate('/signup')

                    }else if(user_status==='alredy email exist' && role === 'Ride'){
                        
                        const data={
                            email:email
                        }
                        Signin(data,signin_urls)

                    }else if (user_status==='alredy email exist' && role === 'Drive'){

                        if (driver_status ==="Driver data success"){

                            const data={
                                email:email
                            }
                            Signin(data,signin_urls,null,"Driver")

                        }else if(driver_status==="Driver not approval"){
                             navigate("/waitingModal")

                        }else if (driver_status==="Driver data is None"){
                            navigate('/vehicle_doc')
                        }
                    
                    }

                }else if (response.data.error){

                    seterrormessage("Invalid OTP enterd")

                }
            }
            
        }catch(error){

            console.log(error,'otpverification ')
        }
       
    }
         
      //..................... Signup api call.....................

     const Signup_validation=async(values,url)=>{

        try {
           console.log(values)
           
            const response = await axios.post(url,values, {

                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.status === 200) {


                if(response.data.success==="success"){



                    console.log(response.data.data.role)
                    if(role==='Ride'){

                        const data={
                            email:response.data.data.email,
                        }
                        toast.success("Congratulations! Your account has been successfully created")
                        Signin(data,signin_urls)
                       

                    }else{

                        console.log(response.data)
                        dispatch(addDriver_data(response.data.data))
                        navigate('/vehicle_doc')
                    }
                    
                }else {

                    toast.warning(response.data.error&&response.data.error.email ? "Email already exist":"Phone number already exists" )

                }

            }else if (response.status===400){
                console.log(response.data, 'signup response');

            }

        } catch (error) {
            console.error('Error submitting form:', error);

        }
     }

                // ...................... Sign in Api call ............................

           
     const Signin = async (data, urls, seterrormessage = null,role=null) => {
    
        try {
          const response = await axios.post(urls, data, {
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          if (response.status === 200) {

            if (role === "admin") {
              console.log(response.data.token)
              const token = response.data.token
              const value = jwtDecode(token.access);
              console.log(value)
              if(value.role){
                Cookies.set("adminTokens", JSON.stringify(token), { expires: 7 });
                const value = jwtDecode(token.access);
                dispatch(addadmin_token(value));
                Get_data(admin_data_url,value.user_id,role);
                toast.success("Login successfully");
                navigate("/admin_home",{replace:true});
              }else{
                toast.warning("Your email and password do not match. Please try again");
            }

    
            } else if( role === "Driver") {

              console.log(response.data.token)
              const token = response.data.token
              Cookies.set("DriverTokens",JSON.stringify(token), { expires: 7 });
              const value = jwtDecode(token.access);
              dispatch(addDriver_token(value));
              let email = response.data.token.email

              Get_data(Driver_data_urls,email,"driver");
              const message = 'Login successfully';
              localStorage.setItem('loginMessage', message);

              window.open('/driver_home', '_blank', 'noopener,noreferrer');


            }else{

              console.log(response.data.token)
              const token = response.data.token
              Cookies.set("userTokens",JSON.stringify(token), { expires: 7 });
              const value = jwtDecode(token.access);
              dispatch(addToken_data(value));
              Get_data(user_data_url, null);
              toast.success("Login successfully");
              navigate("/userhome");

            }

            dispatch(addUser_status(null))
            dispatch(addrole(null))
            dispatch(addemail(null))
            dispatch(addDriver_status(null))
          }
        } catch (error) {
          if (error.response.data.detail === "No active account found with the given credentials" || error.response.data.non_field_errors[0] === "Invalid email or user not active.") {
            toast.warning("Your email and password do not match. Please try again");
          }
          console.log(error, "Signin");
        }
      };


         //...................Driver Creation Api Call......................

      const DriverCreation = async (values, url) => {

        try {
            const formData = new FormData();
            console.log(values,'value')
            Object.keys(values).forEach(key => {
                if (values[key] instanceof File) {
                    formData.append(key, values[key]);

                } else if (typeof values[key] === 'object' && values[key] !== null) {

                    Object.keys(values[key]).forEach(subKey => {
                        formData.append(`${key}[${subKey}]`, values[key][subKey]);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });
        
            console.log(formData,'fromdata')
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        
            if (response.status === 201) {
                console.log(response.data)
                if (response.data.success === "Driver successfully created") {

                        console.log(response.data);
                        toast.success("Congratulations! Your account has been successfully created")
                        navigate("/waitingModal")

                } else {
                    console.log(response.data.error)
                    
                }
            } 
        
        } catch (error) {
            const errorData = error.response?.data || {};

            let data = '';
            if (errorData.aadhaar && errorData.aadhaar.length > 0) {
                data = errorData.aadhaar[0];
            } else if (errorData.vehicle_no && errorData.vehicle_no.length > 0) {
                data = errorData.vehicle_no[0];
            }

            if (data === "Aadhaar already exists"){

                toast.error("aadhaar already exists.")
                return
                
            }else if (data === "driver data with this aadhaar already exists."){

                toast.error("aadhaar already exists.")
                return
                
            }

            if(data === "Vehicle Number already exists"){

                console.log("yes working")
                toast.error("Vehicle Number already exists")
                return 
            }
        
            console.error('Error submitting form:', error);
            toast.error('Error submitting form. Please try again.');
        }
    };

    const GoogleAuth=async(credentials)=>{

        const token = credentials.credential
         const value ={
            role:role,
            token:token
         }
        try{
            const response = await axios.post(GoogleAuth_url,value,{
                headers:{
                    "Content-Type": "application/json",
                }
            })
            if (response.status===200){
                                                            
                if (role === 'Ride'){

                    const data={
                        email: response.data.email
                    }
                    Signin(data,signin_urls)

                }else if(role === "Drive"){

                    const status = response.data.status
                    if (status  === "Driver data success"){
                        
                        const data={
                            email:response.data.email
                        }

                        Signin(data,signin_urls,null,"Driver")

                    }else if(status ==="Driver not approval"){
                         navigate("/waitingModal")

                    }else if (status ==="Driver data is None"){
                        dispatch(addDriver_data(response.data.data))
                        navigate('/vehicle_doc')
                    }
                    
                }
     
            }

        }catch(error){
            console.error(error,'google auth error')
            if(error.response.data.error==="User account is disabled"){
                toast.warning("Your account has been blocked. Please contact our customer service.")

            }
        }
    }

    return {Emailvalidation,Otp_verification,Signup_validation,Signin,DriverCreation,GoogleAuth}

}

export default useAuthentication