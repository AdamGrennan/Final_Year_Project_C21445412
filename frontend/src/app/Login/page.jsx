'use client'

import React, { useState } from "react";
import { auth} from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';

const Login = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async (e) => {
      e.preventDefault();

      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          router.push('/Main');
      } catch (error) {
          const errorMessage = error.message;
          console.error("Error signing in:", errorMessage);
          setError(errorMessage); 
      }
  };

    const register = () =>{
        router.push('/Register');
      }
    
    return (
        <div className="register-container">
        <form className="register-form" onSubmit={onSubmit}>
          <h2>Login</h2>
    
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
          <button type="submit" onClick={onSubmit}>Login</button>
          {error && <p className="error message">{error}</p>}
          </form>

          <label>Register</label>
          <button type="submit" onClick={register}>Register</button>
          </div>
    );
}
export default Login;