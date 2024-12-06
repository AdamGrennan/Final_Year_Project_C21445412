"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Spinner from "./spinner";
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
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useUser } from "@/context/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export function LoginForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userInfo } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();

  setEmailError();
  setPasswordError();

  if (!email) {
    setEmailError("Invalid Email");
    return;
  }

  if (!password) {
    setPasswordError("Invalid Password");
    return;
  }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLoading(true);
          const userData = docSnap.data();

          userInfo({ name: userData.name, uid: user.uid });
          router.push('/Main');
        } else {
          setEmailError("No user details found. Please signup!.");
        }
    } catch (error) {
        const errorMessage = error.message;

        if (errorMessage.includes("user-not-found")) {
          setEmailError("No account found with this email. Please sign up.");
        } else if (errorMessage.includes("wrong-password")) {
          setPasswordError("Incorrect password");
        } else {
          setPasswordError("Failed to log in. Please try again.");
        }
    }
    setLoading(false);
   
};

  return ( 
       
    
    (<Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-PRIMARY font-urbanist font-bold">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold font-urbanist">Email</Label>
            <Input id="email" 
            type="email" 
            placeholder="m@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required />
             {emailError && <p className="text-red-500 text-xs mt-1 font-urbanist">{emailError}</p>}
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
             {passwordError && <p className="text-red-500 text-xs mt-1 font-urbanist">{passwordError}</p>}
          </div>
          <Button type="submit" className="w-full text-white bg-PRIMARY hover:bg-opacity-80" onClick={onSubmit}>
            LOGIN
          </Button>
        </div>
        <div className="mt-4 text-center text-sm font-semibold font-urbanist">
          Dont have an account?{" "}
          <Link href="/Register" className="hover:underline font-semibold font-urbanist text-PRIMARY">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>)  
  );
}
