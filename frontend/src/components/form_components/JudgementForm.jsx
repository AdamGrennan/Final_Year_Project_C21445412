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
import { Switch } from "../ui/switch";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useJudgment } from "@/context/JudgementContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters." })
    .max(20, { message: "Title must be at most 20 characters." }),
  theme: z.string().min(2, { message: "Please select a template." }),
  description: z
    .string()
    .min(4, { message: "Description must be at least 4 characters." })
    .max(50, { message: "Description must be at most 30 characters." }),
  isDecisionMade: z.boolean().default(false),
  deadline: z.date().optional(),
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
        deadline: data.deadline || null,
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
            <h3 className="text-xl font-semibold font-urbanist text-gray-700">Basic Details</h3>
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
            <h3 className="text-xl font-semibold text-gray-700 font-urbanist">Decision Details</h3>
            <div className="w-[150px] border-b border-PRIMARY my-1"></div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="isDecisionMade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-urbanist">Decision Status</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <Switch
                          className="data-[state=checked]:bg-PRIMARY data-[state=unchecked]:bg-gray-300"
                          checked={field.value || false}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                        <span className="text-sm text-gray-700">
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
                name="deadline"
                render={({ field }) =>
                  !form.watch("isDecisionMade") && (
                    <FormItem>
                      <FormLabel className="font-urbanist">Decision Deadline (Optional)</FormLabel>
                      <FormControl>
                        <div className="mt-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span className="font-urbanist">Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                className="font-urbanist bg-white"
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                fromMonth={new Date()} 
                                toMonth={new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }
              />
            </div>
          </section>

          <Button
            type="submit"
            className="w-full py-3 text-white bg-PRIMARY hover:bg-PRIMARY-dark rounded-md"
          >
            Submit
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default JudgementForm;
