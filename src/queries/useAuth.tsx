import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { LoginRequest } from "../interfaces/auth/auth.interface";
import { useAuthStore } from "../store";
import { useNotification } from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const { login: Login } = useAuthStore();
    const navigate = useNavigate();
    const { getSuccess, getError } = useNotification();

    const mutation = useMutation({
        onSuccess: (data) => {
            getSuccess('Bienvenido');
            navigate('/'); // cambias a donde quieres que vaya
            Login(data); 
        },
        onError: (error) => {
            console.log(error);
            getError('Username or password incorrect');
        },
        mutationFn: (Login: LoginRequest) => login(Login),
    });
    return mutation;
  };