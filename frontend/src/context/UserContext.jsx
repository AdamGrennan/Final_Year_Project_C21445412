'use client'
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ name: '', uid: '' }); 
    const userInfo = (userData) => {
        setUser(userData); 
    };

    const logout = () => {
        setUser({ name: '', uid: '' }); 
    };

    return (
        <UserContext.Provider value={{ user, userInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
