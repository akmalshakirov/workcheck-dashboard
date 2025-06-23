import React from "react";
import { useAuth } from "../../hooks/useAuth";
import Login from "../../pages/Login/Login";
import Preloader from "../ui/Preloader/Preloader";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <Preloader />;
    }

    if (!isAuthenticated) {
        return <Login />;
    }

    return children;
};

export default ProtectedRoute;
