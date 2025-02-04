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
import { FaCloudShowersHeavy } from "react-icons/fa";
import { Button } from "../ui/button";

const NoiseCard = ({ noise, noiseSources }) => {
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
      <div>
        {detectedNoise.length > 0 ? (
          detectedNoise.map((noiseItem, index) => (
            <div
              className="font-urbanist font-light mb-6"
              key={index}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span>{iconMap[noiseItem]}</span>
                <span className="text-gray-800 font-medium">{noiseItem}</span>
              </div>

              <ul className="list-disc pl-5">
                {(noiseSources[noiseItem] || []).map((source, index) => (
                  <li key={index} className="text-sm text-PRIMARY font-light">
                    {source}
                  </li>
                ))}
              </ul>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="text-xs text-gray-700 mt-3 hover:bg-gray-100"
                  >
                    View Details
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white w-[300px] max-w-[300px] overflow-visible z-20">
                  <DropdownMenuLabel>
                    Details for {noiseItem}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    {detailsMap[noiseItem]}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        ) : (
          <p>No noise detected</p>
        )}
      </div>
    </div>
  );
};

export default NoiseCard;