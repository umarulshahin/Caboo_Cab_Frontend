import { toast } from "sonner";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addClearUser, addToken_data, addUser, addUserTrips, addWalletDetails } from "../Redux/UserSlice";
import { useNavigate } from "react-router-dom";
import {Driver_data_urls, img_upload_url,PaymentSuccess_url,Reviw_add_url,Ride_User_Data_url,user_data_url,} from "../Utils/Constanse";
import { addadmin_data } from "../Redux/AdminSlice";
import { addDriver_data, addDriver_token } from "../Redux/DriverSlice";
import apiClient from "../Axios/GetDataAxios";
import UserAxios from "../Axios/UserAxios";
import { Razorpay_url } from "../Utils/Constanse";


const useGetUser = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const Get_data = async (urls, value = null, role = null) => {

    try {
      const response = await apiClient.get(urls, {
        params: { id: value },
        meta: { role }, 

        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {

        console.log(response.data, "get user ");
        if (role === "admin") {

          dispatch(addadmin_data(response.data));
        } else if (role === 'driver') {
          console.log("driver get data ")
          dispatch(addDriver_data(response.data));
        } else {
          console.log('User get data ')
          dispatch(addUser(response.data));
        }
      }
    } catch (error) {

      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
  };

  
  const img_validate = async (file,id,role=null,email=null) => {

    if (file) {
     
      const formData = new FormData();
      formData.append("image", file);
      formData.append("id",id)
      try {
        const response = await UserAxios.patch(img_upload_url, formData, {
          meta: { role }, 
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          if (role&& role==='driver'){
            Get_data(Driver_data_urls, email, "driver");

          }else{
            Get_data(user_data_url, null);

          }
          toast.success("Image Update succesfully");
        }
      } catch (error) {
        console.log(error.response.data);
        if(error.response.data.detail=== 'Token is blacklisted'){
          if(role==='driver'){
  
            dispatch(addDriver_data(null))
            dispatch(addDriver_token(null))
            Cookies.remove('DriverTokens')
            toast.warning("Your session has expired. Please log in again to continue.")
            navigate("/")


        }else{
          console.log('yes working logout')
          dispatch(addUser(null))
          dispatch(addToken_data(null))
          Cookies.remove('userTokens')
          toast.warning("Your session has expired. Please log in again to continue.")
          navigate("/")

          
          }
        
        }else if (error.response.data.detail ==="User is inactive"){
          dispatch(addClearUser(null))
          Cookies.remove('userTokens')
          localStorage.removeItem('status')
          toast.warning("Your account has been blocked. Please contact our customer service.")
          navigate("/")
        }else{
          toast.warning(error);

        }

      }
    }
  };

  const ProfilUpdate = async (values, urls,role=null,email=null) => {
    try {
    
      const response = await UserAxios.patch(urls, values, {
        meta: { role }, 

        headers: {

          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        if(role&&role==='driver'){
          console.log(role)    
          Get_data(Driver_data_urls, email, "driver");

        }else{
          Get_data(user_data_url, null);

        }
        toast.success("Profile update successfully");
      }
    } catch (error) {
      console.log(error, "profile Update");
      if(error.response.data.detail=== 'Token is blacklisted'){
        if(role==='driver'){

          dispatch(addDriver_data(null))
          dispatch(addDriver_token(null))
          Cookies.remove('DriverTokens')
        }else{

        dispatch(addUser(null))
        dispatch(addToken_data(null))
        Cookies.remove('userTokens')
        }
        toast.warning("Your session has expired. Please log in again to continue.")
        navigate("/")


      }
      else if (error.response.data.details === "User is inactive"){

        dispatch(addClearUser(null))
        Cookies.remove('userTokens')
        localStorage.removeItem('status')
        toast.warning("Your account has been blocked. Please contact our customer service.")
        navigate("/")
      }
        toast.warning(error);

    }
  };
      
  const paymentSuccess=async(data)=>{

     try{
      console.log(data)
      console.log(PaymentSuccess_url,'url')
      const response = await UserAxios.post(PaymentSuccess_url,data,{
        headers:{
          "Content-Type": "application/json",
        },
      });
      console.log(response)
      
      if (response.status===200){
        console.log(response.data,'success data after payment')
        toast.success("Your wallet successfully recharged")
        await Get_data(user_data_url, null);

      }

     }catch(error){
      console.log(error,'error payment success')
     }
  }

  const LoadScript =()=>{
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const showRazorpay= async(value)=>{

      console.log(value,"yes it's working")
       
       const res = await LoadScript();
       if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      try{
        
        const data=value['amount']
        const response = await UserAxios.post(Razorpay_url,data,{
          headers: {
            "Content-Type": "application/json",
          },

      })
      if(response.status === 200){
          
          const secretKey =import.meta.env.VITE_PUBLIC_KEY
          const {username,phone,email} =value.user[0]
          const {id,amount}=response.data
          const image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD7WSqyfPcRDeODaj88BEbubp2HHXSGveBnPf78nBEXsxFjW7t1a7Wn-WVyDtOjO5Ug8I&usqp=CAU"

          const options = {
            key:secretKey, 
            amount:amount, 
            currency: 'INR',
            name: 'Caboo cab',
            description: 'Test Transaction',
            image:image,
            order_id: id,
            handler: function (response) {
              
              if ('Trip_payment' in value){

              }else{
                paymentSuccess(value)
              }

            },
            prefill: {
              name: username,
              email: email,
              contact: phone
            },
            notes: {
              address: 'Corporate Office'
            },
            theme: {
              color: '#3399cc'
            }
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.open();  
      }else if (response.status===400){
          console.log(response.data['error'],'response')

      }
      }catch(error){
        console.log(error,'razorpay error try catch ')
        if (error.response.status ===400){
          toast.warning(error.response.data.error)
        }
      }
      
  }

  const UserTabls = async(url,data,role)=>{
 
    try{
       const response = await UserAxios.get(url,{
        params: { id: data['id'],page:data['page'] },
        headers:{
          'Content-Type' : "application/json"
        },
       })
       if (response.status === 200){
        if(role==='trip'){
            console.log(response.data,'usertrips')
            dispatch(addUserTrips(response.data))
        }else if(role==='wallet'){
          console.log(response.data,'wallet respond')
          dispatch(addWalletDetails(response.data))
        }
      
       }
    }catch(error){
      console.log(error,'user trips')
    }
  }

  const ReviewManagement= async (url,value)=>{
         console.log(url,'url')
         console.log(value,'value')
         const formdata =new FormData()
         formdata.append('review',value)
    try{

      const response = await UserAxios.post(url,value,{
        headers:{
          "Content-Type": "application/json"
        }
      })
      if (response.status === 200){
        console.log(response.data)
        navigate('/userhome')
        toast.success("Thank you! Your review has been submitted.")


      }

    }catch(error){
        console.log(error,'review hook error')
    }
     

  }
  return { img_validate, Get_data, ProfilUpdate,showRazorpay,UserTabls,ReviewManagement};
};

export default useGetUser;
