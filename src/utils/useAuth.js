import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create context, which will store some state
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
    // State for token and id
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });


   

    const login = (email, password) => {
        axios
            .post(`https://hall-pass-main-ea0ukq.laravel.cloud/api/login`, {
                email,
                password,
            })
            .then((res) => {
                console.log("API Response:", res.data); // Log the entire response

                if (res.data.success) {
                    const token = res.data.data.token; // Access the token correctly
                    console.log("Token received:", token); // Log the token to verify

                    setToken(token); // Set the token in state
                    localStorage.setItem("token", token); // Store the token in local storage

                    // Extract the user ID from the token (all characters before the pipe)
                    

                    
                } else {
                    alert(res.data.message); // Handle unsuccessful login
                }
            })
            .catch((err) => {
                console.error("Login error:", err); // Log the error
                alert('Login failed');
            });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        
 
    };

    const value = {
        
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
