
import React from 'react'
import Cookies from "js-cookie"
import { Navigate } from 'react-router-dom'

const PrivatRoute_user = ({children}) => {
    
    const user=Cookies.get('userTokens')
        return user ? children :< Navigate to="/" /> ;

}

export default PrivatRoute_user