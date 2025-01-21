import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "../ui/label";
import { Button } from "@/components/ui/button";

const Breakdown = ({ breakdown }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div>
        <Label className="font-urbanist font-bold">Breakdown</Label>
        <div className="w-[150px] border-b border-PRIMARY my-1"></div>
      </div>
      <div>
        <ScrollArea className="h-[150px] w-[300px] rounded-md border bg-GRAAY font-urbanist">
          {breakdown ? breakdown.summary : "No Breakdown Available"}
        </ScrollArea>
        <Button
          className="mt-4 bg-PRIMARY text-white"
          onClick={() => setModalOpen(true)}
        >
          View Full Breakdown
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-urbanist font-bold">Full Breakdown</h2>
              <Button
                onClick={() => setModalOpen(false)}
                className="text-sm text-gray-500"
              >
                Close
              </Button>
            </div>
            <div className="mt-4">
              <ScrollArea className="h-[300px] w-full rounded-md border bg-GRAAY font-urbanist">
                {breakdown?.details || "No additional details available."}
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Breakdown;
