'use client'
import React, { createContext, useContext, useState } from 'react';

const DecisionContext = createContext();

export const DecisionProvider = ({ children }) => {
    const [detectedBias, setDetectedBias] = useState([]);
    const [detectedNoise, setDetectedNoise] = useState([]);
    const [biasSources, setBiasSources] = useState({});
    const [noiseSources, setNoiseSources] = useState({});
    const [advice, setAdvice] = useState({});
    const [strengths, setStrengths] = useState([]);
    const [improvements, setImprovements] = useState([]);

    const formatBias = (bias) => {
        if (typeof bias !== "string") {
          return bias; 
        }
      
        const result = bias.replace(/([A-Z])/g, " $1");
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return finalResult.trim();
      };
      

    const detectBias = (bias, source) => {
        if (bias) {
            const formattedBias = formatBias(bias)
            setDetectedBias((prev) => [...prev, formattedBias]);

            setBiasSources((prev) => ({
                ...prev,
                [formattedBias]: [...(prev[formattedBias] || []), source].slice(0, 2), 
            }));
          }
    };

    const detectNoise = (noise, source) => {
        if(noise){
            setDetectedNoise((prev) => [...prev, noise]);

            setNoiseSources((prev) => ({
                ...prev,
                [noise]: [...(prev[noise] || []), source].slice(0, 2), 
            }));
        }
    };

    return (
        <DecisionContext.Provider value={{ 
        detectNoise,
        detectBias, 
        detectedBias, 
        detectedNoise,
        setDetectedBias, 
        setDetectedNoise,
        biasSources,
        noiseSources,
        setBiasSources,
        setNoiseSources,
        advice,
        setAdvice,
        strengths, 
        setStrengths,
        improvements,
        setImprovements
        }}>
            {children}
        </DecisionContext.Provider>
    );
};

export const useDecision = () => {
    return useContext(DecisionContext);
};