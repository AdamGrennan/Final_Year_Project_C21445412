"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { useForm, FormProvider} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth"; 
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).max(50, { message: "Title must be at most 50 characters." }),
  template: z.string().min(2, { message: "Template must be at least 2 characters." }),
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  outcome: z.string().min(2, { message: "Expected outcome must be at least 2 characters." }),
  confidenceLevel: z.enum(["Low", "Medium", "High"], { message: "Please select a confidence level." })
});

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange"
  });

  const [userId, setUserId] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); 
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);


  const onSubmit = async (data) => {
    try {
      const judgeRef = await addDoc(collection(db, "judgement"), {
        ...data,
        createdAt: new Date(),
        userId: userId
      });
      alert("Judgement saved successfully!");
      router.push(`/Chat_Page/${judgeRef.id}`);
      
    } catch (error) {
      console.error("Error saving judgement:", error);
      alert("Failed to save judgement.");
    }
  
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Input placeholder="Template" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Outcome</FormLabel>
              <FormControl>
                <Input placeholder="Expected Outcome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confidenceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confidence Level</FormLabel>
              <FormControl>
                <div className="flex space-x-4">
                  {["Low", "Medium", "High"].map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => field.onChange(level)}
                      className={`px-4 py-2 rounded ${
                        field.value === level
                          ? level === "Low"
                            ? "bg-red-500 text-white"
                            : level === "Medium"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                    <Link href="/Chat_Page" className="underline font-semibold font-urbanist text-PRIMARY">
            CHAT PAGE
          </Link>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
    
  );
}
