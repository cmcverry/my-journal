import React, { useState} from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Login from '../components/Login/Login';

const Layout = () => {

    const [showLogin, setShowLogin] = useState(false);

    const handleLoginClick = () => {
        setShowLogin((showLogin) => !showLogin);
    }

    return (
        <>
            <Navbar handleLoginClick={handleLoginClick} />
            <Login showLogin={showLogin} handleLoginClick={handleLoginClick}/>
            <Outlet/>
        </>
    );
};

export default Layout;