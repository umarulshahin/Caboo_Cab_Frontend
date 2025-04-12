import React from 'react'
import useUserWebSocket from '../Socket/Socket'
import UserAxios from '../Axios/UserAxios'
import { Razorpay_url } from '../Utils/Constanse'
import { toast } from 'sonner'
const useOnlinePayment = () => {
 
    const {sendMessage}=useUserWebSocket()
    const LoadScript =()=>{
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      }

    const showOnline = async(value)=>{
     
        console.log(value,"yes it's working")
         
         const res = await LoadScript();
         if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }
  
        try{
          
          const data=value['amount']
          console.log(value)
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
              key:secretKey, // Replace with your Razorpay Key ID
              amount:amount, // Amount is in the smallest currency unit
              currency: 'INR',
              name: 'Caboo cab',
              description: 'Test Transaction',
              image:image,
              order_id: id,
              handler: function (response) {
  
                console.log(response,'response')
                if ('razorpay_order_id' in response){
                   sendMessage(value)
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
    return {showOnline}

}
export default useOnlinePayment