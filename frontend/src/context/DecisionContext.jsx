'use client'
import React, { createContext, useContext, useState } from 'react';

const DecisionContext = createContext();

export const DecisionProvider = ({ children }) => {
    const [biasCount, setBiasCount] = useState([]);
    const [detectedBias, setDetectedBias] = useState([]);
    const [noiseCount, setNoiseCount] = useState([]);
    const [detectedNoise, setDetectedNoise] = useState([]);
    const [breakdown, setBreakdown] = useState("");

    const formatBias = (bias) => {
        const result = bias.replace(/([A-Z])/g, " $1");
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return finalResult.trim();
    }

    const detectBias = (bias) => {
        if (bias) {
            const formattedBias = formatBias(bias)
            setDetectedBias((prev) => [...prev, formattedBias]);
          }
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
        if(noise){
            setDetectedNoise((prev) => [...prev, noise]);
        }
    };

    const clearNoise = () => {
        setNoiseCount([]);
        setDetectedNoise([]);
    };

    const createBreakdown = (breakdown) => {
        setBreakdown(breakdown);
    };

    return (
        <DecisionContext.Provider value={{ 
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