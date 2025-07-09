import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { baseURL } from "../App";

const { createContext } = require("react");

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const token = localStorage.getItem("token");
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAdmin = async () => {
            try {
                setLoading(true);

                const response = await axios.get(`${baseURL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAdmin(response.data.admin);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        loadAdmin();
    }, []);

    const login = (adminData) => {
        setAdmin(adminData);
    };

    const logout = () => {
        setAdmin(null);
    };

    const value = {
        admin,
        loading,
        error,
        login,
        logout,
    };

    return (
        <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
    );
};
