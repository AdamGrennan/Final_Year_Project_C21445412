"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuBicepsFlexed } from "react-icons/lu";
import { FaAnchor } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdCallSplit } from "react-icons/md";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

const BiasCard = ({ bias, biasSources }) => {
  const sampleBias = [
    { type: "Overconfidence Bias", context: "Detected in outcome prediction" },
    { type: "Anchoring Bias", context: "Detected in initial estimates" },
  ];

  const iconMap = {
    "Overconfidence Bias": <LuBicepsFlexed />,
    "Anchoring Bias": <FaAnchor />,
    "Confirmation Bias": <FaMagnifyingGlass />,
    "Framing Bias": <MdCallSplit />,
  };

  const detailsMap = {
    "Overconfidence Bias":
      "Overconfidence bias is a tendency to overestimate our own abilities, knowledge, or decision-making accuracy. This can lead to risky choices and ignoring critical feedback.",
    "Anchoring Bias":
      "Anchoring bias occurs when individuals rely too heavily on the first piece of information they receive (the 'anchor') when making decisions. This can cause people to make judgments that are skewed toward that initial value, even when better information is available.",
    "Confirmation Bias":
      "Confirmation bias is the tendency to seek out, interpret, and remember information that confirms pre-existing beliefs while ignoring contradictory evidence. This can reinforce misconceptions and hinder objective decision-making.",
    "Framing Bias":
      "Framing bias happens when people react differently to the same information depending on how it is presented. For example, a product described as '90% effective' may seem more appealing than one described as having a '10% failure rate,' even though both statements convey the same fact.",
  };

  return (
    <div className="w-[250px]">
      <div>
        {bias.length > 0 ? (
          bias.map((biasItem, index) => (
            <div
              className="font-urbanist font-light mb-6"
              key={index}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span>{iconMap[biasItem]}</span>
                <span className="text-gray-800 font-light">{biasItem}</span>
              </div>

              <ul className="list-disc pl-5">
                {(biasSources[biasItem] || []).map((source, index) => (
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
                <DropdownMenuContent className="font-urbanist bg-white w-[300px] max-w-[300px] overflow-visible z-20">
                  <DropdownMenuLabel>
                    Details for {biasItem}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    {detailsMap[biasItem]}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        ) : (
          <p className="font-urbanist">No biases detected.</p>
        )}
      </div>
    </div>
  );
};

export default BiasCard;
