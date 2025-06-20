import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
export const baseURL = "http://localhost:7000";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [logedIn, setLogedIn] = useState(false);
    const navigate = useNavigate();

    const login = async (username, password) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        try {
            const resposne = await axios.post(`${baseURL}/login`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (resposne.status === 200 || resposne.status === 201) {
                setLogedIn(true);
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logout = async () => {
        await axios.get(`${baseURL}/logout`);
    };

    return (
        <AuthContext.Provider value={{ logedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
