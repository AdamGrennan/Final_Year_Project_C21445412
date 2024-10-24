"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { useUser } from "@/context/UserContext";

export function RegisterForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { userInfo } = useUser(); 
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
        userInfo({ name: name, uid: user.uid }); 

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

  return ( 
      
    (<Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-PRIMARY font-urbanist font-bold">Sign Up</CardTitle>
        <CardDescription>
          Enter your email below to sign up
        </CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold font-urbanist">Email</Label>
            <Input id="email" 
            type="email" 
            placeholder="m@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-semibold font-urbanist">Name</Label>
            <Input id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="font-semibold font-urbanist">Password</Label>
            </div>
            <Input
             id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required />
          </div>
          <Button type="submit" className="w-full text-white bg-PRIMARY" onClick={onSubmit}>
            REGISTER
          </Button>
        </div>
        </form>
        <div className="mt-4 text-center text-sm font-semibold font-urbanist">
          Already have an account?{" "}
          <Link href="/" className="underline font-semibold font-urbanist text-PRIMARY">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>)  
  );
}
