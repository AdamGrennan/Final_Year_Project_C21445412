"use client";
import * as React from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import JudgementForm from "@/components/form_components/JudgementForm";

export default function Page() {
  return (
    <div className="flex justify-center items-start min-h-screen w-full">
      <div className="flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg">
        <Label 
          htmlFor="terms" 
          className="font-urbanist text-PRIMARY text-2xl font-semibold text-center"
        >
         Start a New Decision
        </Label>
        <JudgementForm />
      </div>
    </div>
  );
};
