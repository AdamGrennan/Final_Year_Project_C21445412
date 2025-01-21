"use client"
import * as React from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import JudgementForm from "@/components/form_components/JudgementForm";


export default function Page() {
  return (
    <div className="gap-4 p-4">
      <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-semibold mb-2 ">Ready to Make a Decision?</Label>
      <JudgementForm/>
    </div>
  );
};
