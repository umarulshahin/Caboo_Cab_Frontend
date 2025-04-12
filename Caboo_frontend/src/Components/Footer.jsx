import React from 'react'
import logo from '../assets/Logo.png'

const Footer = () => {
  return (
    <div className='h-96 bg-black text-white '>
        
            <div className=' pl-36 pt-8 h-auto  '>
             <img  src={logo} alt="Logo" className="h-14 mx-auto md:mx-0" />
             <span className='text-xl pl-5 pt-5 font-bold block'>Visit Help Center</span>

            </div>
            <div className='flex'>
                <div className='pl-36 pt-6'>
                    <span className='text-xl pl-5  font-bold block'>Company</span>
                    <div className='flex flex-col space-y-3 pl-5 pt-2'>
                    <span>About us</span>
                    <span>Our offerings</span>
                    <span>Gift cards</span>
                    <span>Careers</span>
                    <span>Ai</span>
                    </div>

                </div>
                <div className='pl-52 pt-6'>
                    <span className='text-xl pl-5  font-bold block'>Product</span>
                    <div className='flex flex-col space-y-3 pl-5 pt-2'>
                    <span>Ride</span>
                    <span>Drive</span>
                    <span>Deliver</span>
                    <span>Caboo for bussiness</span>
                    </div>

                </div>
                <div className='pl-52 pt-6'>
                    <span className='text-xl pl-5  font-bold block'>Global citizenship</span>
                    <div className='flex flex-col space-y-3 pl-5 pt-2'>
                    <span>Safty</span>
                    <span>Diversity and  inclusion</span>
                    <span>Sustainability </span>
                    </div>

                </div>
                <div className='pl-52 pt-6'>
                    <span className='text-xl pl-5  font-bold block'>Travel</span>
                    <div className='flex flex-col space-y-3 pl-5 pt-2'>
                    <span>Riverse</span>
                    <span>Airport</span>
                    <span>Cities</span>
                    </div>

                </div>
            </div>

    </div>
  )
}

export default Footer