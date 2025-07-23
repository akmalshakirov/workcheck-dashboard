import { createContext, useState } from "react";

export const AdminContext = createContext({
    admin: null,
    setAdmin: () => {},
    branch: null,
    setBranch: () => {},
});

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [branch, setBranch] = useState(null);

    return (
        <AdminContext.Provider value={{ admin, setAdmin, branch, setBranch }}>
            {children}
        </AdminContext.Provider>
    );
};
