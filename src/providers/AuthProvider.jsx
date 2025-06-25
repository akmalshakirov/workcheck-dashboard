import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../App";
import Preloader from "../components/ui/Preloader/Preloader";
import { AuthContext } from "../hooks/useAuth";

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [preLoader, setPreLoader] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // const login = async (username, password) => {
    //     setPreLoader(true);

    //     const formData = new FormData();
    //     formData.append("username", username);
    //     formData.append("password", password);

    //     try {
    //         await axios.post(`${baseURL}/login`, formData, {
    //             withCredentials: true,
    //         });

    //         setIsAuthenticated(true);
    //         navigate("/");
    //         await checkAuth();
    //     } catch (error) {
    //         const errorMessage =
    //             error.response?.data?.error || "Tarmoq xatosi yuz berdi";
    //         return { success: false, error: errorMessage };
    //     } finally {
    //         setPreLoader(false);
    //     }
    // };

    const logout = async () => {
        setPreLoader(true);
        try {
            await axios.post(
                `${baseURL}/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
        } finally {
            setIsAuthenticated(false);
            setPreLoader(false);
            navigate("/login");
        }
    };

    const contextValue = {
        isAuthenticated,
        setIsAuthenticated,
        // login,
        logout,
    };

    // CHECK AUTH FUNCTION HERE
    const checkAuth = async () => {
        setPreLoader(true);
        try {
            const response = await axios.get(`${baseURL}/check-auth`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } finally {
            setTimeout(() => {
                setPreLoader(false);
            }, 100);
        }
    };
    useEffect(() => {
        checkAuth();
        if (isAuthenticated === null) {
            setPreLoader(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated !== null) {
            navigate(isAuthenticated ? location.pathname : "/login", {
                replace: true,
            });
        }
    }, [isAuthenticated]);

    return (
        <>
            <AuthContext.Provider value={contextValue}>
                {preLoader ? <Preloader /> : null}
                {children}
            </AuthContext.Provider>
        </>
    );
};

export default AuthProvider;
