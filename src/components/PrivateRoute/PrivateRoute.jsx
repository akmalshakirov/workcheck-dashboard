// import React from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import Preloader from "../ui/Preloader/Preloader";

// const ProtectedRoute = ({ children }) => {
//     const { isAuthenticated, isLoading } = useAuth();
//     const navigate = useNavigate();

//     if (isLoading) {
//         return <Preloader />;
//     }

//     if (!isAuthenticated) {
//         return navigate("/login");
//     }

//     return children;
// };

// export default ProtectedRoute;
