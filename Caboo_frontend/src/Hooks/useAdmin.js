
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
            console.log(response.data,)
            console.log(role)
            if(role==="driver"){
              dispatch(addDriver_list(response.data))
              return

            }else if(role==="user"){
                console.log('yes working user')
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

                console.log(response.data,'user managment')
                toast.success("status successfully updated")
                return
            }
        }catch(error){
            console.error(error,"Usermanagment")

        }
    }

    const GetTripdata=async(data)=>{
        try{
            console.log(data,'data in get trips')
            const responds = await AdminAxios.get(Get_all_trips_url,{
                params:data,
                headers:{

                    "Content-Type":"application/json"
                }
            })
            if (responds.status===200){
                console.log(responds.data)
                dispatch(addAllTrips(responds.data))
            }
            
        }catch(error){
            console.log(error,'get trip data')
        }
    }

    const CouponManage= async (url,data)=>{
      
        try{
            console.log(url,'url ')
            console.log(data,'data')
            const response = await AdminAxios.post(url,data,{
                
                headers:{
                    "Content-Type" : "multipart/form-data",
                }
            })

            if (response.status === 201){
                console.log(response.data,'coupon manage')
                toast.success('Coupon Created successfully')
            }
            console.log(response,'response')
        }catch(error){
            console.log(error,'couponManage')
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
            console.log(error,'get coupons')
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
                console.log(response.data,'coupon update')
                toast.success("Coupon updated successfully")
            }
        }catch(error){
           
            console.log(error,'coupon update error')
        }
    }

    return {GetUsers,Usermanagement,GetTripdata,CouponManage,Get_Coupon,Update_coupon}
}
export default useAdmin