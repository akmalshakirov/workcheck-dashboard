import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState([]);
    const navigate = useNavigate();

    const login = async (username, password) => {
        try {
            const data = {
                user: { username, password },
                accessToken: "fakeToken123",
            };
            setUser([data.user]);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logout = () => {
        setUser([]);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
