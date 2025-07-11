import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { baseURL } from "../App";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const token = localStorage.getItem("token");
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
