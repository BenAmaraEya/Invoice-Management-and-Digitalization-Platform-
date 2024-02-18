import React from "react";
import Header from './../Header/Header';
import Routers from '../../router/Routers';
import Footer from './../Footer/Footer';

const Layout = () => {
    return (
        <>
            <Header />
            <Routers />
            <Footer />
        </>
    );
};

export default Layout;
/*import React from "react";
import DefaultHeader from './../Header/DefaultHeader';
import DashboardHeader from './../Header/DashboardHeader';
import ProfileHeader from './../Header/ProfileHeader';
import Routers from '../../router/Routers';
import Footer from './../Footer/Footer';
import { useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();

    // Define a function to determine which header component to render based on the current route
    const renderHeader = () => {
        if (location.pathname === "/dashboard") {
            return <DashboardHeader />;
        } else if (location.pathname === "/profile") {
            return <ProfileHeader />;
        } else {
            return <DefaultHeader />;
        }
    };

    return (
        <>
            {renderHeader()}
            <Routers />
            <Footer />
        </>
    );
};

export default Layout;*/
