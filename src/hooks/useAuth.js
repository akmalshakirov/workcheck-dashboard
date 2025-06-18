import axios from "axios";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // const login = async (credentials) => {
    //     const { data } = await axios.post("/api/auth/login", credentials, {
    //         withCredentials: true,
    //     });
    //     setUser(data.user);
    //     axios.defaults.headers.common[
    //         "Authorization"
    //     ] = `Bearer ${data.accessToken}`;
    // };

    const logout = async () => {
        await axios.post("/api/auth/logout", {}, { withCredentials: true });
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
