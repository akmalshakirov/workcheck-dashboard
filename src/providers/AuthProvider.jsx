import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../App";
import { AuthContext } from "../hooks/useAuth";

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
                setUser(response.data.admins);
                setIsAuthenticated(true);
                setError(null);
                return true;
            } else {
                setIsAuthenticated(false);
                setUser(null);
                return false;
            }
        } catch (error) {
            setError("Tarmoq xatosi yuz berdi");
            setIsAuthenticated(false);
            setUser(null);
            if (error.response === 401) {
                navigate("/login");
            }
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
                navigate("/");
                return { success: true };
            } else {
                setError(response.data.message || "Login xatosi");
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Tarmoq xatosi yuz berdi";
            setError(errorMessage);
            if (error.resposne.data.status === 401) {
                navigate("/login");
            }
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
            navigate("/login", { replace: true });
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
            }, 1 * 60 * 1000);

            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const contextValue = {
        isAuthenticated,
        setIsAuthenticated,
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
