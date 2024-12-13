'use client'
import React, { createContext, useContext, useState } from 'react';

const BiasContext = createContext();

export const BiasProvider = ({ children }) => {
    const [biasCount, setBiasCount] = useState([]);

    const countBias = (bias) => {
        setBiasCount((prevCounts) => {
            const updatedCounts = { ...prevCounts };
            updatedCounts[bias] = (updatedCounts[bias] || 0) + 1; 
            return updatedCounts;
        });
    }

    return (
        <BiasContext.Provider value={{countBias, biasCount}}>
            {children}
        </BiasContext.Provider>
    );
};

export const useBias = () => {
    return useContext(BiasContext);
};
