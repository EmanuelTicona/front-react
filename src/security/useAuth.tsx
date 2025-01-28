import { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { jwtExpiration } from '../utils/auth';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const token = user?.token;
    if (token) {
      try {
        if (jwtExpiration(token)) {
          logout();
          setShouldRedirect(true);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error)
        logout();
        setShouldRedirect(true);
      }
    } else {
      setShouldRedirect(true);
    }
  }, [logout, user]);

  return { isAuthenticated, shouldRedirect };
};

export default useAuth;
