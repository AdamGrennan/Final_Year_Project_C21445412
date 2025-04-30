"use client";
import * as React from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import JudgementForm from "@/components/form-components/JudgementForm";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-100">
      <div className="flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <Label 
            htmlFor="terms" 
            className="font-urbanist text-2xl font-semibold text-center"
          >
            Start a New Decision
          </Label>
          <div className="w-[200px] border-b-4 border-PRIMARY mx-auto mt-2"></div>
        </div>
        <JudgementForm />
      </div>
    </div>
  );
}
