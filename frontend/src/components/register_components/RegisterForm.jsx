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
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { userInfo } = useUser();
  const router = useRouter();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSubmit(event);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault()

    setEmailError();
    setPasswordError();

    if (!email) {
      setEmailError("Invalid Email");
      return;
    }

    if (!password) {
      setPasswordError("Invalid Password");
      return;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (password.length > 6 && name && email) {
      await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          newUser: true,
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
        });
    } else {
      console.log("Invalid Inputs!");
    }
  }

  return (

    (<Card className="w-[400px] h-[450px]">
      <CardHeader>
        <CardTitle className="text-2xl text-PRIMARY font-urbanist font-semibold">Sign Up</CardTitle>
        <CardDescription className="font-urbanist">
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
                className="font-urbanist"
                value={email}
                onKeyPress={handleKeyPress}
                onChange={(e) => setEmail(e.target.value)}
                required />
              {emailError && <p className="text-red-500 text-xs mt-1 font-urbanist">{emailError}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold font-urbanist">Name</Label>
              <Input id="name"
                type="text"
                className="font-urbanist"
                value={name}
                onKeyPress={handleKeyPress}
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
                className="font-urbanist"
                value={password}
                onKeyPress={handleKeyPress}
                onChange={(e) => setPassword(e.target.value)}
                required />
              {passwordError && <p className="text-red-500 text-xs mt-1 font-urbanist">{passwordError}</p>}
            </div>
            <Button type="submit" className="w-full text-white bg-PRIMARY hover:bg-opacity-80" >
              REGISTER
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm font-semibold font-urbanist">
          Already have an account?{" "}
          <Link href="/" className="hover:underline font-semibold font-urbanist text-PRIMARY">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>)
  );
}
