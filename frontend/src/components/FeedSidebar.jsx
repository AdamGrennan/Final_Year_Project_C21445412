"use client"

import React from "react";
import { Label } from './ui/label';

const FeedSideBar = ({ bias }) => {

  const detectedBias = Array.from(
    new Set(bias.filter((b) => b !== "neutral"))
  );


    return (
        <div className="w-[250px] p-4">
           <Label className="font-urbanist font-medium">Detected Bias</Label>
            <div className="w-[150px] border-b border-PRIMARY my-1"></div>
          <div>
            <ul className="list-disc pl-4">
              {detectedBias.length > 0 ? (
                detectedBias.map((detectedBias, index) => <li key={index}>{detectedBias}</li>)
              ) : (
                <li>No biases detected</li>
              )}
            </ul>
          </div>
          <div className="mt-4">
          <Label className="font-urbanist font-medium">Detected Noise</Label>
          <div className="w-[150px] border-b border-PRIMARY my-1"></div>
          </div>
        </div>
      );
};

export default FeedSideBar;