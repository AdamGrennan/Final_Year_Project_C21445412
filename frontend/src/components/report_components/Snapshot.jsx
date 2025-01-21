"use client"

import React from "react";
import { Label } from '../ui/label';
import DoughnutChart from "@/components/report_components/DoughnutChart";

const Snapshot = ({ bias }) => {

    return (
        <div className="w-[250px]">
           <Label className="font-urbanist font-bold">Snapshot</Label>
            <div className="w-[150px] border-b border-PRIMARY my-1"></div>
            <DoughnutChart bias={bias}/>
        </div>
      );
};

export default Snapshot;