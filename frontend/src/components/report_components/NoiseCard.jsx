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
import { MdOutlineCheckCircle } from "react-icons/md";
import { Button } from "../ui/button";

const NoiseCard = ({ noise, noiseSources }) => {
  const sampleNoise = ["Level Noise", "Occasion Noise"];

  const detectedNoise = Array.from(new Set(noise));

  return (
    <div className="flex-1 overflow-y-auto h-[250px] p-4 scrollbar-thin scrollbar-thumb-SECONDARY scrollbar-track-GRAAY">
      <div>
        {detectedNoise.length > 0 ? (
          detectedNoise.map((noiseItem, index) => (
            <div
              className="font-urbanist font-light mb-6"
              key={index}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span>{iconMap[noiseItem]}</span>
                <span className="text-gray-800 font-light">{noiseItem}</span>
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
          <div className="flex flex-col justify-center items-center text-center translate-y-8">
          <MdOutlineCheckCircle className="w-32 h-32 text-SECONDARY"/>
          <p className="font-urbanist font-light">No Noise Detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoiseCard;