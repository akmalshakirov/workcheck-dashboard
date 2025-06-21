import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { logedIn } = useAuth();
    const location = useLocation();
    if (!logedIn) {
        return <Navigate to='/login' replace state={{ from: location }} />;
    }
    return children;
};

export default PrivateRoute;
