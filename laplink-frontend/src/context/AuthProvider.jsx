import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({}); // { user, accessToken, refreshToken }
    const [loading, setLoading] = useState(true);

    // Initialize auth from localStorage if available (simplified for now)
    useEffect(() => {
        const storedAuth = JSON.parse(localStorage.getItem("laplink_auth"));
        if (storedAuth) {
            setAuth(storedAuth);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // userData = { user, accessToken, refreshToken }
        setAuth(userData);
        localStorage.setItem("laplink_auth", JSON.stringify(userData));
    };

    const logout = () => {
        setAuth({});
        localStorage.removeItem("laplink_auth");
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
