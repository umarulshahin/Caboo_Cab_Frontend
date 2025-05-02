import User_header from '../../Components/user_side/User_header';
import Footer from '../../Components/Footer';
import { Outlet } from 'react-router-dom';

const UserMain = () => {
    
    return (
        <div className="relative min-h-screen overflow-x-hidden ">
            <User_header />
            <div className="pt-16"> 
             <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default UserMain;
