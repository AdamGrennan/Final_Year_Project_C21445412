'use client'
import React, { createContext, useContext, useState } from 'react';

const DecisionContext = createContext();

export const DecisionProvider = ({ children }) => {
    const [biasCount, setBiasCount] = useState([]);
    const [detectedBias, setDetectedBias] = useState([]);
    const [noiseCount, setNoiseCount] = useState([]);
    const [detectedNoise, setDetectedNoise] = useState([]);
    const [breakdown, setBreakdown] = useState("");

    const countBias = (bias) => {
        setBiasCount((prevCounts) => {
            const updatedCounts = { ...prevCounts };
            updatedCounts[bias] = (updatedCounts[bias] || 0) + 1; 
            return updatedCounts;
        });
    };

    const detectBias = (bias) => {
        setDetectedBias((prev) => [...prev, bias]);
    };

    const clearBias = () => {
        setBiasCount([]);
        setDetectedBias([]);
    };

    const countNoise = (noise) => {
        setNoiseCount((prevCounts) => {
            const updatedCounts = { ...prevCounts };
            updatedCounts[noise] = (updatedCounts[noise] || 0) + 1; 
            return updatedCounts;
        });
    };

    const detectNoise = (noise) => {
        setDetectedNoise((prev) => [...prev, noise]);
    };

    const clearNoise = () => {
        setNoiseCount([]);
        setDetectedNoise([]);
    };

    const createBreakdown = (breakdown) => {
        setBreakDown(breakdown);
    };

    return (
        <DecisionContext.Provider value={{countBias, 
        biasCount, 
        detectNoise,
        detectBias, 
        detectedBias, 
        detectedNoise,
        clearBias,
        setBreakdown,
        breakdown}}>
            {children}
        </DecisionContext.Provider>
    );
};

export const useDecision = () => {
    return useContext(DecisionContext);
};