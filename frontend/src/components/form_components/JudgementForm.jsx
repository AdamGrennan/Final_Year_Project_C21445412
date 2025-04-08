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
import { useJudgment } from "@/context/JudgementContext";

const formSchema = z.object({
  title: z.string().min(4, { message: "Title must be at least 4 characters." }).max(20),
  theme: z.string().min(2, { message: "Please select a template." }),
  details: z.object({
    situation: z.string().min(4, { message: "Situation is required." }),
    options: z.string().optional(),
    influences: z.string().optional(),
    goal: z.string().optional(),
  }),
});

const JudgementForm = () => {
  const { judgmentInfo } = useJudgment();
  const [date, setDate] = useState(new Date());
  const { user } = useUser();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      theme: "",
      details: {
        situation: "",
        options: "",
        influences: "",
        goal: "",
      },
    },
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
    <div className="mr-auto p-6 bg-white w-[600px]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <Input
                        className="font-urbanist border border-gray-300 focus:border-SECONDARY focus:ring-SECONDARY bg-white"
                        placeholder="Enter title"
                        {...field}
                      />
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

          <section className="space-y-4">
            <FormField
              control={form.control}
              name="details.situation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-urbanist">What's the situation?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. I've been offered a job in another city"
                      {...field}
                      className="font-urbanist border border-gray-300 bg-white focus:border-SECONDARY focus:ring-SECONDARY "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <details className="mt-2 border-t pt-4 text-sm text-gray-600">
              <summary className="cursor-pointer font-urbanist font-semibold text-SECONDARY">
                Add more context (optional)
              </summary>
              <div className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="details.options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-urbanist">Options you're considering</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Take job offer, stay put"
                          {...field}
                          className="font-urbanist border border-gray-300 bg-white focus:border-SECONDARY focus:ring-SECONDARY "
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details.influences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-urbanist">What's influencing you?</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Deadline next week, manager conflict"
                          {...field}
                          className="font-urbanist border border-gray-300 bg-white focus:border-SECONDARY focus:ring-SECONDARY "
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details.goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-urbanist">Ideal outcome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Better work-life balance"
                          {...field}
                          className="font-urbanist border border-gray-300 bg-white focus:border-SECONDARY focus:ring-SECONDARY "
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </details>
          </section>

          <div className="flex justify-center items-center pt-4">
            <Button
              type="submit"
              className="w-1/2 font-urbanist py-4 text-white bg-PRIMARY hover:bg-opacity-80 rounded-md"
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
