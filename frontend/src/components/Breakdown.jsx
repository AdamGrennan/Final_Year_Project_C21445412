"use client"
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "./ui/label";

const Breakdown = () => {

    return (
        <div>
        <div>
        <Label className="font-urbanist font-medium">Breakdown</Label>
        <div className="w-[150px] border-b border-PRIMARY my-1"></div>
        </div>
       <div>
           <ScrollArea className="h-[200px] w-[100px] rounded-md border p-4 bg-GRAAY">
          </ScrollArea>

        </div>
        </div>
      );
};

export default Breakdown;