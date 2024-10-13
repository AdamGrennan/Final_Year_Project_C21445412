'use client'

import React, { useState } from "react";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';

const Register = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault()

        if(password.length > 8 && name && email){

          await createUserWithEmailAndPassword(auth, email, password).then(async(userCredential) => {
            const user = userCredential.user;
            console.log(user);      

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                createdAt: new Date()
              }).catch((error) => {
                console.log("Error writing document: ", error);
            });
              console.log("User registered:", user.uid);

            router.push('/Main');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            setError(errorMessage);
        });
        }else{
          setError("Invalid Inputs!");
        }     
    }

    const login = () =>{
      router.push('/Login');
    }

    return(
    <div className="register-container">
    <form className="register-form" onSubmit={onSubmit}>
      <h2>Register</h2>

      <label>Email</label>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Enter your email" 
        required 
      />
       <label>Password</label>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Enter your password" 
        required 
      />
       <label>Name</label>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Enter your name" 
        required 
      />
      <button type="submit">Register</button>
      {error && <p className="error message">{error}</p>}
      </form>

      <label>Login</label>
      <button type="submit" onClick={login}>Login</button>
      </div>
      );
}

export default Register;