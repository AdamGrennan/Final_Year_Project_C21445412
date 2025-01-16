"use client"
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Button } from "@/components/ui/button";
import TemplateSelect from "@/components/TemplateSelect";
import { useUser } from "@/context/UserContext";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Switch } from "./ui/switch";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 8 characters." })
    .max(50, { message: "Title must be at most 30 characters." }),
  template: z.string().min(2, { message: "Please select a template." }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 8 characters." }),
  isDecisionMade: z.boolean().default(false),
  calendar: z.date().optional(),
});

const JudgementForm = () => {
  const [date, setDate] = React.useState(new Date());
  const { user } = useUser();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const judgeRef = await addDoc(collection(db, "judgement"), {
        ...data,
        createdAt: new Date(),
        userId: user.uid,
      });
      router.push(`/Chat_Page/${judgeRef.id}`);
    } catch (error) {
      console.error("Error saving judgement:", error);
      alert("Failed to save judgement.");
    }
  };

  return (
    <FormProvider {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex space-x-4 gap-60">
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
                <TemplateSelect
                  onSelect={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isDecisionMade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Decision Status</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-4">
                <Switch
                  className="data-[state=checked]:bg-PRIMARY data-[state=unchecked]:bg-GRAAY"
                  checked={field.value || false}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
                <span className="text-sm text-gray-700 font-urbanist">
                  {field.value ? "Decision Made" : "Decision Unresolved"}
                </span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="calendar"
        render={({ field }) => (
          !form.watch("isDecisionMade") && ( 
            <FormItem>
              <FormLabel>Decision Deadline (Optional)</FormLabel>
              <FormControl>
                <Calendar
                  mode="single"
                  selected={field.value || date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    field.onChange(selectedDate);
                  }}
                  className="rounded-md border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        )}
      />
      <Button type="submit" className="bg-PRIMARY text-white">Submit</Button>
    </form>
  </FormProvider>
  );
};
export default JudgementForm;
