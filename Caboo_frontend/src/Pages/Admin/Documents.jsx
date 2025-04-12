import React from 'react'
import Admin_header from '../../Components/Admin/Admin_header';
import Footer from '../../Components/Footer';
import Documents_page from '../../Components/Admin/Documents_page';

const Documents = () => {
  
    
      return (
        <div>
            <div>
            <Admin_header />
    
            </div>
            <div className='bg-black'>
                 <Documents_page />
            </div>
            <div>
                <Footer />
            </div>
        </div>
      )
}

export default Documents