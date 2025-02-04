"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Button } from "@/components/ui/button";
import TemplateSelect from "@/components/form_components/TemplateSelect";
import { useUser } from "@/context/UserContext";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useJudgment } from "@/context/JudgementContext";

const formSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters." })
    .max(20, { message: "Title must be at most 20 characters." }),
  theme: z.string().min(2, { message: "Please select a template." }),
  description: z
    .string()
    .min(4, { message: "Description must be at least 4 characters." })
    .max(100, { message: "Description must be at most 100 characters." }),
});

const JudgementForm = () => {
  const { judgmentInfo } = useJudgment();
  const [date, setDate] = useState(new Date());
  const { user } = useUser();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const decisionData = {
        ...data,
        createdAt: new Date(),
        userId: user.uid,
        isCompleted: false,
      };

      const judgeRef = await addDoc(collection(db, "judgement"), decisionData);
      judgmentInfo(decisionData);
      router.push(`/Chat_Page/${judgeRef.id}`);
    } catch (error) {
      console.error("Error saving judgement:", error);
      alert("Failed to save judgement.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-md rounded-md">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold font-urbanist text-gray-700">Decision Details</h3>
            <div className="w-[150px] border-b border-PRIMARY"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="font-urbanist">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input className="font-urbanist" placeholder="Enter a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-urbanist">Theme</FormLabel>
                    <FormControl>
                      <TemplateSelect onSelect={(value) => field.onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-urbanist">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="font-urbanist"
                      placeholder="Provide a detailed description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <div className="flex justify-center items-center">
          <Button
            type="submit"
            className="w-1/2 font-urbanist py-3 text-white bg-PRIMARY hover:bg-PRIMARY-dark rounded-md"
          >
            Submit
          </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default JudgementForm;
