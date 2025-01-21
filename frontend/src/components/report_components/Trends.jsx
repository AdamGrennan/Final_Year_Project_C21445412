"use client"
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const Trends = ({ similiarDecisions }) => {
  
  return (
    <div>
      <Label className="font-urbanist font-bold">Trends & Patterns</Label>
      <div className="w-[150px] border-b border-PRIMARY my-1"></div>
      <ScrollArea>
        <div className="flex flex-col text-gray-500">
          {similiarDecisions.length === 0 ? (
            <div className="flex flex-col text-gray-500">
              <p className="text-sm font-urbanist font-light">No frequent trends detected</p>
            </div>
          ) : (
            similiarDecisions.map((decision) => (
              <div key={decision.id} className="flex items-center justify-start">
                <Button
                  className="w-full text-left bg-GRAAY text-black rounded-md font-urbanist h-auto mb-4"
                >
                  <div className="flex flex-col w-full">
                  </div>
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Trends;