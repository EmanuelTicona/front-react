import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";

export const Redirection: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            if (user == null || user === undefined) {
                console.log(user)
                navigate('/login');
            } else {
                console.log(user)
                navigate('/');
            }
        }, 1200);

        return () => clearTimeout(redirectTimer);
    }, [user, navigate]);

    return null; // No renderiza nada
}
