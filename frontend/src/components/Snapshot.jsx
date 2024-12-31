"use client"

import React from "react";
import { Label } from './ui/label';
import DoughnutChart from "@/components/DoughnutChart";

const Snapshot = () => {

    return (
        <div className="w-[250px] p-4">
           <Label className="font-urbanist font-medium">Snapshot</Label>
            <div className="w-[150px] border-b border-PRIMARY my-1"></div>
            <DoughnutChart/>
        </div>
      );
};

export default Snapshot;