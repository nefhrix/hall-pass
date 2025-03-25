import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext();

// Hook to use the Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return null;
        }
    });
    

    // Fetch user details when token is available
    useEffect(() => {
        if (token && !user) {
            fetchUserDetails(token);
        }
    }, [token]);

    // Fetch user details
    const fetchUserDetails = async (token) => {
        try {
            const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Fetched User Data:", res.data);

            const userData = {
                id: res.data.id,
                name: res.data.name,
                roles: res.data.roles || [],
            };

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (err) {
            console.error("Error fetching user data:", err);
            logout(); // Logout if fetching user data fails
        }
    };

    // Login function
    const login = (email, password) => {
        axios.post(`https://hall-pass-main-ea0ukq.laravel.cloud/api/login`, { email, password })
            .then((res) => {
                console.log("Login API Response:", res.data); // Debug the response
    
                if (res.data.success && res.data.data) {
                    const token = res.data.data.token;
                    setToken(token);
                    localStorage.setItem("token", token);
    
                    // Fetch user details after getting the token
                    axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((userRes) => {
                        console.log("Fetched User Data:", userRes.data); // Debug user data
    
                        const userData = {
                            id: userRes.data.id, 
                            name: userRes.data.name,
                            roles: userRes.data.roles,
                        };
    
                        setUser(userData);
                        localStorage.setItem("user", JSON.stringify(userData));
                    })
                    .catch((userErr) => {
                        console.error("Error fetching user data:", userErr);
                    });
                } else {
                    console.error("Unexpected login response structure:", res.data);
                    alert(res.data.message || "Login failed");
                }
            })
            .catch((err) => {
                console.error("Login error:", err.response?.data || err);
                alert('Login failed');
            });
    };
    

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
