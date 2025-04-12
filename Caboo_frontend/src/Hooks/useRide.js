
import UserAxios from "../Axios/UserAxios"

const useRide = () => {
 
    const RideRequest=async(url,values)=>{
        
        try{
            const response= await UserAxios.post(url,values,{
                headers:{
                    "Content-Type": "multipart/form-data"
                }
            })
            
            if (response.status===200){
                console.log(response.data,"ride request")
            }
        }catch(error){
            console.error("ride request",error)
        }
    }

    return {RideRequest}
}

export default useRide