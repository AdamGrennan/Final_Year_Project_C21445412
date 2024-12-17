"use client"

import React from "react";
import { Label } from './ui/label';

const FeedSideBar = ({ bias }) => {

    return (
        <div className="w-[250px] p-4 border-l bg-gray-100">
           <Label className="font-urbanist font-medium">Detected Bias</Label>
            <div className="w-[150px] border-b border-PRIMARY my-1"></div>
          <div>
            <ul className="list-disc pl-4">
              {bias.length > 0 ? (
                bias.map((bias, index) => <li key={index}>{bias}</li>)
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