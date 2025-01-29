import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Breakdown = ({ breakdown }) => {
  return (
    <div>
      <div>
        <ScrollArea className="h-[150px] w-[300px] rounded-md border bg-GRAAY font-urbanist">
          {breakdown ? breakdown.summary : "No Breakdown Available"}
        </ScrollArea>
      </div>
      </div>
      );
    };
export default Breakdown;
