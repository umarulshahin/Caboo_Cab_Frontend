import { useDispatch } from 'react-redux';
import DriverAxios from '../Axios/DriverAxios';
import { addDriver_data, addDriverTrips,} from '../Redux/DriverSlice';
import { toast } from 'sonner';
import { Trip_driver_Data_url } from '../Utils/Constanse';

const useDriver = () => {
    const dispatch=useDispatch()
    const Driver_status =async(urls,values)=>{
        
        try{
            const response = await DriverAxios.patch(urls,values,{
                
                headers: {
                    "Content-Type": "multipart/form-data",
                  },
            })
            if (response.status===200){
                if (response.data.current_Status){
                    toast.success('Online')
                }else{
                    toast.info("Offline")
                }
                const data=[response.data]
                dispatch(addDriver_data(data))
            } 
        }catch(error){
            console.error("Driver status",error)
        }
    }
    
    const DriverTrips=async(data)=>{
        console.log(data['id'],'data')
        try{
           const response = await DriverAxios.get(Trip_driver_Data_url,{
            params: { id: data['id'] },
            headers:{
              'Content-Type' : "application/json"
            },
           })
           if (response.status === 200){

            if (response.data != 'Trips not availabel'){
                console.log(response.data,'usertrips')
                dispatch(addDriverTrips(response.data))
            }
            

           }
        }catch(error){
          console.log(error,'user trips')
        }
      }
    return { Driver_status,DriverTrips }
};

export default useDriver;
