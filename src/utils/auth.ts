import { jwtDecode, JwtPayload } from "jwt-decode";

export function jwtExpiration(token: string | null) {
    const decodedToken = jwtDecode<JwtPayload>(token || '');
    const expirationTime = decodedToken?.exp ?? 0;
    const isTokenExpired = expirationTime * 1000 < Date.now();
    return isTokenExpired;
}