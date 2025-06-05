import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"}/auth/check-auth`,
                    { withCredentials: true }
                );
                setAuthenticated(response.data.authenticated);
            } catch (err) {
                console.error('Error checking authentication:', err);
                setApiError(true);
            } finally {
                setLoading(false);
            }
        };
        checkAuthentication();
    }, []);

    const handleLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"}/auth/atlassian`;
    };

    const handleGuestAccess = () => {
        setIsGuest(true);
        setAuthenticated(true); // Allow access to protected routes
    };

    const handleLogout = async () => {
        try {
            if (!isGuest) {
                await axios.get(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"}/auth/logout`, { withCredentials: true });
            }
            setAuthenticated(false);
            setIsGuest(false);
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    return { authenticated, isGuest, loading, apiError, handleLogin, handleLogout, handleGuestAccess };
};

export default useAuth;