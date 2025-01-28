import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from '../common/NavBar/NarBar';

export const RouterLayout: React.FC = () => {
    return(
        <>
            <NavBar/>
            <Outlet/>
        </>
    )
};