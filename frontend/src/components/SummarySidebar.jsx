"use client"
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import React from "react";

const SummarySideBar = () => {

    return (
        <div className="w-[250px] p-4">
           <Label className="font-urbanist font-medium">Areas to Improve</Label>
            <div className="w-[150px] border-b border-PRIMARY my-1"></div>
          <div className="mt-4">
          <Label className="font-urbanist font-medium">Strengths</Label>
          <div className="w-[150px] border-b border-PRIMARY my-1"></div>
          </div>

        </div>
      );
};

export default SummarySideBar;