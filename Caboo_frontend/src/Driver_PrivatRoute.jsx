import React from 'react'
import Cookies from "js-cookie"
import { Navigate } from 'react-router-dom'

const Driver_PrivatRoute = ({children}) => {

    const driver=Cookies.get('DriverTokens')
    
    return driver ?  children : < Navigate to="/" /> ;
}

export default Driver_PrivatRoute