import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RouterLayout } from "../layouts/RouterLayout";
//import ProtectedRoute from "../security/ProtectedRoute";
import LoginView from "../pages/auth/login/Login";
import NotFound from "../common/Not_found/NotFound";
import HomeView from "../pages/home/HomeView";

export const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RouterLayout/>}>
                    <Route path="/" element={<HomeView/>} />
                    <Route path="/login" element={<LoginView/>} />
                    {/* <Route path="/schools" element={<ProtectedRoute component={SchoolView} />} /> Esto un una pantalla que solo se accede con token*/}
                    <Route path="*" element={<NotFound root=""/>} />
                </Route>
            </Routes>
        </Router>
    );
};