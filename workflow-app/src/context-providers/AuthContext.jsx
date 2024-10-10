import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // Correct usage of useState

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); 
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); 
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) { 
            setUser(JSON.parse(storedUser)); 
        }
    }, [setUser]);  // Correct dependency array with setUser

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
