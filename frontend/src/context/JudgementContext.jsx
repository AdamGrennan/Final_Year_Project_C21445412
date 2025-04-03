'use client';
import React, { createContext, useContext, useState } from 'react';

const JudgmentContext = createContext();

export const JudgmentProvider = ({ children }) => {
  const [judgmentData, setJudgmentData] = useState({
    title: '',
    theme: '',
    details: {
      situation: '',
      options: '',
      influences: '',
      goal: ''
    }
  });

  const judgmentInfo = (judgmentData) => {
    setJudgmentData(judgmentData); 
  };

  return (
    <JudgmentContext.Provider value={{ judgmentData, judgmentInfo }}>
      {children}
    </JudgmentContext.Provider>
  );
};

export const useJudgment = () => {
  return useContext(JudgmentContext);
};
