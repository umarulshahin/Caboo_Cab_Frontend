import React, { useState } from 'react';
import UserWallet from '../../Components/user_side/UserWallet';
import User_header from '../../Components/user_side/User_header';
import Footer from '../../Components/Footer';
import UserProfile_main from '../../Components/user_side/UserProfile_main';

const UserMain = () => {
    const [status, setStatus] = useState('');

    const renderComponent = () => {
        switch (status) {
            case 'profile':
                return <UserProfile_main />;
            case 'wallet':
                return <UserWallet />;
            case 'settings':
                return <Settings />;
            default:
                return null; // Render nothing if no status is selected
        }
    };

    return (
        <div className="relative min-h-screen bg-black">
            <User_header setStatus={renderComponent} />
            <div className="pt-16"> {/* Added pt-16 for padding top */}
                {renderComponent()}
            </div>
            <Footer />
        </div>
    );
};

export default UserMain;
