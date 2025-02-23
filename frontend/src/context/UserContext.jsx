'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, onAuthStateChanged, doc, getDoc, setDoc } from '@/config/firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
  
                const userRef = doc(db, 'users', firebaseUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userSnap.data() });
                } else {
    
                    await setDoc(userRef, { email: firebaseUser.email, name: "" });
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: "" });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
