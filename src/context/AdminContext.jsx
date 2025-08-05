import { createContext, useState } from "react";

export const AdminContext = createContext({
    admin: null,
    setAdmin: () => {},
    branch: null,
    setBranch: () => {},
    loading: false,
    setLoading: () => {},
});

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [branch, setBranch] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <AdminContext.Provider
            value={{ admin, setAdmin, branch, setBranch, loading, setLoading }}>
            {children}
        </AdminContext.Provider>
    );
};
