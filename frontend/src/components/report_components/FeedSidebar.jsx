"use client"

import React from "react";
import { Label } from '../ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LuBicepsFlexed } from "react-icons/lu";
import { FaAnchor } from "react-icons/fa";
import { PiScalesFill } from "react-icons/pi";
import { MdNoiseAware } from "react-icons/md";
import { MdOutlineShowChart } from "react-icons/md";
import { FaCloudShowersHeavy } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";



const FeedSideBar = ({ bias, noise }) => {

  const iconMap = {
    "Overconfidence Bias": <LuBicepsFlexed />,
    "Anchoring Bias": <FaAnchor />,
    "Confirmation Bias": <FaMagnifyingGlass />,
    "Level Noise": <PiScalesFill />,
    "Pattern Noise": <MdOutlineShowChart />,
    "Occassion Noise": <FaCloudShowersHeavy />,
  }

  const detailsMap = {
    "Overconfidence Bias": "Overconfidence bias is a tendency to hold a false and misleading assessment of our skills, intellect, or talent. In short, it's an egotistical belief that we're better than we actually are.",
  }

  const detectedBias = Array.from(
    new Set([...bias.filter((b) => b !== "neutral"), ...bias])
  );

  const detectedNoise = Array.from(
    new Set([...noise, noise])
  );

  return (
    <div className="w-[250px]">
      <Label className="font-urbanist font-bold">Detected Bias</Label>
      <div className="w-[150px] border-b border-PRIMARY my-1"></div>
      <div>
        {detectedBias.length > 0 ? (
          detectedBias.map((biasItem, index) => (
            <div className="font-urbanist font-light flex items-center justify-between" key={index}>
              <DropdownMenu className="bg-white">
                <DropdownMenuTrigger className="flex items-center justify-between">
                  <span>{biasItem}</span>
                  <span className="ml-2">{iconMap[biasItem]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white w-[300px] max-w-[300px] overflow-hidden">
                  <DropdownMenuLabel>Details for {biasItem}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{detailsMap[biasItem]}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        ) : (
          <p>No bias detected</p>
        )}
      </div>
      <div className="mt-4">
        <Label className="font-urbanist font-bold">Detected Noise</Label>
        <div className="w-[150px] border-b border-PRIMARY my-1"></div>
        <div>
          {detectedNoise.length > 0 ? (
            detectedNoise.map((noiseItem, index) => (
              <div className="font-urbanist font-light flex items-center justify-between" key={index}>
                <DropdownMenu className="bg-white">
                  <DropdownMenuTrigger className="flex items-center justify-between">
                  <span>{noiseItem}</span>
                  <span className="ml-2">{iconMap[noiseItem]}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>Details for {noiseItem}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
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

export default FeedSideBar;