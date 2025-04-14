
import { useDispatch } from 'react-redux'
import { addAllTrips, addCoupons, addDriver_list, addUsers_list } from '../Redux/AdminSlice'
import { Get_all_trips_url, Get_Coupon_url, get_Driver_url, get_Users_url, Update_Coupon_url } from '../Utils/Constanse'
import { toast } from 'sonner'
import AdminAxios from '../Axios/AdminAxios'
import { useNavigate } from 'react-router-dom'

const useAdmin = () => {

    const dispatch=useDispatch()
    const navigate=useNavigate()

    const GetUsers=async(urls,role=null)=>{

        try{
           
         const response = await AdminAxios.get(urls,{
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

         if(response.status===200){
          
            if(role==="driver"){
              dispatch(addDriver_list(response.data))
              return

            }else if(role==="user"){
                dispatch(addUsers_list(response.data))
                return

            }
         }

        }catch(error){
            console.error(error,"get users")
        }
    }

    const Usermanagement=async(urls,value)=>{
        
        try{
            const response= await AdminAxios.post(urls,value,{
                headers:{
                    "Content-Type" : "multipart/form-data",
                }
            })

            if (response.status===200){

                toast.success("status successfully updated")
                return
            }
        }catch(error){
            console.error(error,"Usermanagment")

        }
    }

    const GetTripdata=async(data)=>{
        try{
            const responds = await AdminAxios.get(Get_all_trips_url,{
                params:data,
                headers:{

                    "Content-Type":"application/json"
                }
            })
            if (responds.status===200){
                dispatch(addAllTrips(responds.data))
            }
            
        }catch(error){
            console.error(error,'get trip data')
            if(error.response.status===401){
                toast.warning('Your session has expired. Please log in again to continue.')
            }
         toast.warning('something went wrong, please try again later.')
    }
    }
    const CouponManage= async (url,data)=>{
      
        try{
         
            const response = await AdminAxios.post(url,data,{
                
                headers:{
                    "Content-Type" : "multipart/form-data",
                }
            })

            if (response.status === 201){
                toast.success('Coupon Created successfully')
            }
        }catch(error){
            console.error(error,'couponManage')
        }
    }
    const Get_Coupon=async()=>{
        try{
            const response =await AdminAxios.get(Get_Coupon_url,{
                headers:{
                    "Content-Type":"application/json"

                }

            })
            if(response.status === 200){
               dispatch(addCoupons(response.data))
            }

        }catch(error){
            console.error(error,'get coupons')
        }
    }

    const Update_coupon=async(data)=>{

        try{
            const response = await AdminAxios.put(Update_Coupon_url,data,{
                headers:{
                    "Content-Type":"multipart/form-data",
                }
            })
            if(response.status===200){
                toast.success("Coupon updated successfully")
            }
        }catch(error){
           
            console.error(error,'coupon update error')
        }
    }

    return {GetUsers,Usermanagement,GetTripdata,CouponManage,Get_Coupon,Update_coupon}
}
export default useAdmin