
import React from 'react'
import Cookies from "js-cookie"
import {  Navigate, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
const AdminPrivatRoute = ({children}) => {
    const navigate=useNavigate()
    const admin=Cookies.get('adminTokens')
    if(admin){
        const rawtoken=JSON.parse(admin)
        const token = jwtDecode(rawtoken.access)
        return !token.role ? < Navigate to="/admin" /> : children ;

    }else{
        navigate('/admin')
    }
   

    

}

export default AdminPrivatRoute;