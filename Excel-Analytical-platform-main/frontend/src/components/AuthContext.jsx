import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

// REASON: A single context is created to hold all shared state.
const AuthContext = createContext(null);

// REASON: This is the single, correct custom hook that all other components will use to access the context.
export const useAuth = () => useContext(AuthContext);

// REASON: The single, correct Provider component that will wrap your application in main.jsx.
export const AuthProvider = ({ children }) => {
    // --- Authentication State ---
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // --- Shared Data State ---
    const [excelData, setExcelData] = useState([]);
    const [columnHeaders, setColumnHeaders] = useState([]);
    const [fileName, setFileName] = useState('');

    // REASON: This effect runs when the app first loads to check for an existing valid token.
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // REASON: Checks if the token is expired.
                if (Date.now() >= decoded.exp * 1000) {
                    localStorage.removeItem('token');
                    setUser(null);
                    setToken(null);
                } else {
                    setUser(decoded.user);
                    api.defaults.headers.common['x-auth-token'] = token;
                }
            } catch (e) {
                // REASON: If the token is invalid for any reason, clear it.
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
            }
        }
        setLoading(false);
    }, [token]);

    // REASON: The login function that updates the global state.
    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        const decodedUser = jwtDecode(newToken).user;
        setUser(decodedUser);
        setToken(newToken);
        api.defaults.headers.common['x-auth-token'] = newToken;
    };

    // REASON: The logout function that clears all session and data state.
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setExcelData([]);
        setColumnHeaders([]);
        setFileName('');
        delete api.defaults.headers.common['x-auth-token'];
    };

    // REASON: The value object provides all state and functions to any component that uses the 'useAuth' hook.
    const value = {
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
        excelData,
        setExcelData,
        columnHeaders,
        setColumnHeaders,
        fileName,
        setFileName
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};