"use client"
import * as React from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import JudgementForm from "@/components/JudgementForm";


export default function Page() {
  return (
    <div>
      <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold mb-2 ">Capture Your Judgment</Label>
      <JudgementForm/>
    </div>
  );
};
