'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UserProvider = createContext(null);

export const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); 
      } else {
        setUser(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <UserProvider.Provider value={user}>
      {children}
    </UserProvider.Provider>
  );
};

export const useUser = () => useContext(UserProvider);
