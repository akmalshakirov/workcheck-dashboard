import axios from "axios";
import React, { useEffect, useState } from "react";
import { AuthContext } from "../hooks/useAuth";
import { baseURL } from "../App";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const validateToken = async () => {
        try {
            const response = await axios.get(`${baseURL}/check-auth`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                setError(null);
                navigate("/", { replace: true });
                return true;
            } else {
                setIsAuthenticated(false);
                setUser(null);
                return false;
            }
        } catch (err) {
            setError("Tarmoq xatosi yuz berdi");
            setIsAuthenticated(false);
            setUser(null);
            return false;
        }
    };

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await axios.post(`${baseURL}/login`, formData, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                setError(null);
                navigate("/", { replace: true });
                return { success: true };
            } else {
                setError(response.data.message || "Login xatosi");
                return { success: false, error: response.data.message };
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Tarmoq xatosi yuz berdi";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                `${baseURL}/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (err) {
            console.error("Logout xatosi:", err);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            await validateToken();
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const interval = setInterval(() => {
                validateToken();
            }, 5 * 60 * 1000);

            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const contextValue = {
        isAuthenticated,
        isLoading,
        user,
        error,
        login,
        logout,
        validateToken,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
