import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const baseURL = "http://localhost:7000";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [logedIn, setLogedIn] = useState(false);
    const navigate = useNavigate();

    const login = async (
        username,
        password,
        setLoading,
        setError,
        setSuccess
    ) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        try {
            const response = await axios.post(`${baseURL}/login`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                setLogedIn(true);
                setTimeout(() => {
                    navigate("/");
                }, 10000);
                // navigate("/");
                toast.success(response.data.message);
                setSuccess(response.data.message);
                console.log(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.code === "ERR_NETWORK"
                    ? "Server ishlamayabdi"
                    : error.response.data.error
            );
            setError(
                error.code === "ERR_NETWORK"
                    ? "Server ishlamayabdi"
                    : error.response.data.error
            );
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await axios.get(`${baseURL}/logout`);
        setLogedIn(false);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ logedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
