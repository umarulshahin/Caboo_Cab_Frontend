import React from 'react'
import Driver_Header from '../../Components/Driver/Driver_Header'
import Footer from '../../Components/Footer'
import { Outlet } from 'react-router-dom'

const DriverMain = () => {
  return (
<div className="relative min-h-screen overflow-x-hidden ">
            <Driver_Header />
            <div className="pt-16"> 
             <Outlet />
            </div>
            <Footer />
        </div>  )
}

export default DriverMain