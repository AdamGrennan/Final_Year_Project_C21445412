"use client"
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "./ui/label";

const Breakdown = () => {

  const fetchBreakdown = async () => {
  const responseGPT = await fetch('http://127.0.0.1:5000/gpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: input.trim() }),
  })
};

    return (
        <div>
        <div>
        <Label className="font-urbanist font-medium">Breakdown</Label>
        <div className="w-[150px] border-b border-PRIMARY my-1"></div>
        </div>
       <div>
           <ScrollArea className="h-[100px] w-[300px] rounded-md border p-4 bg-GRAAY">
          </ScrollArea>

        </div>
        </div>
      );
};

export default Breakdown;