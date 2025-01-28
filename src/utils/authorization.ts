import { AxiosHeaders } from "axios";
import { useAuthStore } from "../store";
import { jwtExpiration } from "./auth";

export const getAuthorizationHeaders = (): AxiosHeaders => {
  const { user, logout } = useAuthStore.getState();
  const headers = new AxiosHeaders();

  if (user && user.token) {
    if(!jwtExpiration(user.token)){
      headers.set("Authorization", `Bearer ${user.token}`);
    }else{
      logout();
    }
  }

  return headers;
};