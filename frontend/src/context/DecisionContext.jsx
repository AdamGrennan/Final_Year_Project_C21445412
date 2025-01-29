'use client'
import React, { createContext, useContext, useState } from 'react';

const DecisionContext = createContext();

export const DecisionProvider = ({ children }) => {
    const [biasCount, setBiasCount] = useState([]);
    const [detectedBias, setDetectedBias] = useState([]);
    const [noiseCount, setNoiseCount] = useState([]);
    const [detectedNoise, setDetectedNoise] = useState([]);
    const [breakdown, setBreakdown] = useState("");
    const [occasionNoiseScore, setOccasionNoiseScore] = useState(0);
    const [levelNoiseScore, setLevelNoiseScore] = useState(0);
    const [patternNoiseScore, setPatternNoiseScore] = useState(0);

    const formatBias = (bias) => {
        if (typeof bias !== "string") {
          console.warn("Invalid bias value passed to formatBias:", bias);
          return bias; // Return the original value if it's not a string
        }
      
        const result = bias.replace(/([A-Z])/g, " $1");
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return finalResult.trim();
      };
      

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

    const detectNoise = (noise, percentage) => {
        if(noise){
            setDetectedNoise((prev) => [...prev, noise]);
        }

        if (noise === "Occasion Noise" && percentage !== null) {
            setOccasionNoiseScore((prev) => prev + percentage);
        } else if (noise === "Level Noise" && percentage !== null) {
            setLevelNoiseScore((prev) => prev + percentage);
        } else if (noise === "Pattern Noise" && percentage !== null) {
            setPatternNoiseScore((prev) => prev + percentage);
        }
    };

    return (
        <DecisionContext.Provider value={{ 
        biasCount, 
        detectNoise,
        detectBias, 
        detectedBias, 
        detectedNoise,
        setDetectedBias, 
        setDetectedNoise,
        clearBias,
        setBreakdown,
        breakdown,
        occasionNoiseScore,
        patternNoiseScore,
        levelNoiseScore}}>
            {children}
        </DecisionContext.Provider>
    );
};

export const useDecision = () => {
    return useContext(DecisionContext);
};