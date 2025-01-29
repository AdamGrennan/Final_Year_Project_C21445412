"use client"

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PiScalesFill } from "react-icons/pi";
import { MdOutlineShowChart } from "react-icons/md";
import { FaCloudShowersHeavy } from "react-icons/fa";;

const NoiseCard = ({ noise }) => {
  const sampleNoise = ["Level Noise", "Occasion Noise"];

  const iconMap = {
    "Level Noise": <PiScalesFill />,
    "Pattern Noise": <MdOutlineShowChart />,
    "Occasion Noise": <FaCloudShowersHeavy />,
  }

  const detailsMap = {
    "Level Noise": "Level noise refers to consistent differences in judgment severity between individuals. Some people may consistently be harsher or more lenient in their decisions compared to others, even when evaluating the same situation.",
    
    "Pattern Noise": "Pattern noise occurs when the same person makes inconsistent judgments in similar cases. This can be due to subconscious preferences, varying interpretations, or personal biases affecting different decisions unpredictably.",
    
    "Occasion Noise": "Occasion noise happens when external factors such as mood, stress, fatigue, or time of day impact decision-making. For example, someone might make a harsher judgment when they are tired or hungry compared to when they are well-rested."
  };
  

  const detectedNoise = Array.from(new Set(noise));

  return (
    <div className="w-[250px]">
      <div className="mt-4">
        <div>
          {detectedNoise.length > 0 ? (
            detectedNoise.map((noiseItem, index) => (
              <div className="font-urbanist font-light flex items-center justify-between" key={index}>
                <DropdownMenu className="bg-white">
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2">
                      {noiseItem}
                      <div className="ml-2">{iconMap[noiseItem]}</div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>Details for {noiseItem}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem>{detailsMap[noiseItem]}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <p>No noise detected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoiseCard;