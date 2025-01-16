"use client"
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "./ui/label";

const Breakdown = ({ breakdown }) => {
  const[breakdownText, setBreakdownText] = useState("");

    return (
        <div>
        <div>
        <Label className="font-urbanist font-medium">Breakdown</Label>
        <div className="w-[150px] border-b border-PRIMARY my-1"></div>
        </div>
       <div>
           <ScrollArea className="h-[100px] w-[300px] rounded-md border p-4 bg-GRAAY">
            {breakdown}
          </ScrollArea>
        </div>
        </div>
      );
};

export default Breakdown;