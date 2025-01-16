"use client"

import React from "react";
import { Label } from './ui/label';


const FeedSideBar = ({ bias, noise }) => {

  const detectedBias = Array.from(
    new Set(bias.filter((b) => b !== "neutral"))
  );

  const detectedNoise = Array.from(
    new Set(noise)
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
                <p>No bias detected</p>
              )}
            </ul>
          </div>
          <div className="mt-4">
          <Label className="font-urbanist font-medium">Detected Noise</Label>
          <div className="w-[150px] border-b border-PRIMARY my-1"></div>
          <div>
            <ul className="list-disc pl-4">
              {detectedNoise.length > 0 ? (
                detectedNoise.map((detectedNoise, index) => <li key={index}>{detectedNoise}</li>)
              ) : (
                <p>No noise detected</p>
              )}
            </ul>
          </div>
          </div>
        </div>
      );
};

export default FeedSideBar;