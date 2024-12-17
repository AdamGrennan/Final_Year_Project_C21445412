"use client"

import React from "react";
import { Label } from './ui/label';

const Snapshot = () => {

    return (
        <div className="w-[250px] p-4 border-l bg-gray-100">
           <Label className="font-urbanist font-medium">Snapshot</Label>
            <div className="w-[150px] border-b border-PRIMARY my-1"></div>
        </div>
      );
};

export default Snapshot;