import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
    const { authenticated, isGuest } = useAuth();
    const isAuthenticated = secureLocalStorage.getItem("session") !== null;
    
    return (authenticated || isGuest || isAuthenticated) ? children : <Navigate to="/" />;
}

export default ProtectedRoute;