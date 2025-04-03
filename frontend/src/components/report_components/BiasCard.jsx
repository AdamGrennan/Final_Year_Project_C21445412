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
import { FaMagnifyingGlass } from "react-icons/fa6";
import { PiScalesFill } from "react-icons/pi";
import { FaCloudShowersHeavy, FaHourglassHalf, FaAnchor } from "react-icons/fa";
import {MdOutlineShowChart, MdCallSplit } from "react-icons/md";
import { BiSolidBadgeCheck } from "react-icons/bi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const BiasCard = ({ bias, noise, biasSources, noiseSources, advice }) => {

  const combinedItems = [...new Set([...bias, ...noise])];

  const iconMap = {
    "Overconfidence Bias": <LuBicepsFlexed />,
    "Anchoring Bias": <FaAnchor />,
    "Confirmation Bias": <FaMagnifyingGlass />,
    "Framing Bias": <MdCallSplit />,
    "Recency  Bias": <FaHourglassHalf />,
    "Lenient Level Noise": <PiScalesFill />,
    "Harsh Level Noise": <PiScalesFill />,
    "Pattern Noise": <MdOutlineShowChart />,
    "Occasion Noise": <FaCloudShowersHeavy />,
  };

  const detailsMap = {
    "Recency Bias":
    "Recency Bias is a cognitive bias where people give greater importance to recent events, experiences, or information while ignoring or underestimating older data. This bias can lead to distorted decision-making, as individuals may believe that recent occurrences are more significant, predictive, or representative than they actually are. For example, an investor may assume that a stock performing well in the past few weeks will continue to rise, ignoring long-term trends. In everyday life, recency bias can also affect judgment in areas like hiring decisions, where interviewers might favor candidates they met last, or in news consumption, where people overestimate the importance of the latest headlines. This tendency to overweight recent information can result in impulsive choices and a failure to consider the broader historical context.",
    "Overconfidence Bias":
      "Overconfidence bias is a tendency to overestimate our own abilities, knowledge, or decision-making accuracy. This can lead to risky choices and ignoring critical feedback.",
    "Anchoring Bias":
      "Anchoring bias occurs when individuals rely too heavily on the first piece of information they receive (the 'anchor') when making decisions. This can cause people to make judgments that are skewed toward that initial value, even when better information is available.",
    "Confirmation Bias":
      "Confirmation bias is the tendency to seek out, interpret, and remember information that confirms pre-existing beliefs while ignoring contradictory evidence. This can reinforce misconceptions and hinder objective decision-making.",
    "Framing Bias":
      "Framing bias happens when people react differently to the same information depending on how it is presented. For example, a product described as '90% effective' may seem more appealing than one described as having a '10% failure rate,' even though both statements convey the same fact.",
    "Lenient Level Noise":
      "Level noise refers to consistent differences in judgment severity between individuals. Some people may consistently be harsher or more lenient in their decisions compared to others, even when evaluating the same situation.",
    "Harsh Level Noise":
    "Level noise refers to consistent differences in judgment severity between individuals. Some people may consistently be harsher or more lenient in their decisions compared to others, even when evaluating the same situation.",
    "Pattern Noise":
      "Pattern noise occurs when the same person makes inconsistent judgments in similar cases. This can be due to subconscious preferences, varying interpretations, or personal biases affecting different decisions unpredictably.",
    "Occasion Noise":
      "Occasion noise happens when external factors such as mood, stress, fatigue, or time of day impact decision-making. For example, someone might make a harsher judgment when they are tired or hungry compared to when they are well-rested."
  };

  return (
    <div className="w-full">
      {combinedItems.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {combinedItems.map((item, index) => (
              <CarouselItem key={index} className="w-full">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">{iconMap[item]}</span>
                  <span className="text-gray-800 font-semibold text-lg">
                    {item}
                  </span>
                </div>

                <p className="text-gray-700 text-sm">{detailsMap[item]}</p>

                <h4 className="mt-3 font-semibold text-black text-sm">
                  Sources:
                </h4>
                <ul className="list-disc pl-5 text-sm text-PRIMARY font-light">
                  {(biasSources[item] || noiseSources[item] || []).map((source, i) => (
                    <li key={i}>{source}</li>
                  ))}
                </ul>
                <h4 className="mt-3 font-semibold text-black text-sm">
                  How To Improve:
                </h4>
                <p className="text-gray-700 text-sm">{advice[item] || "No Advice Generated!"}</p>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-urbanist bg-white w-[300px] max-w-[300px] overflow-visible z-20">
                    <DropdownMenuLabel>
                      Details for {item}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>{detailsMap[item]}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-[97%] -translate-y-1/2 w-full flex justify-between px-12">
            <CarouselPrevious className="bg-white hover:bg-white text-black py-2 px-4 rounded-full transition relative mr-8" />
            <CarouselNext className="bg-white hover:bg-white text-black py-2 px-4 rounded-full transition relative ml-8" />
          </div>
        </Carousel>
      ) : (
        <div className="flex flex-col justify-center items-center text-center translate-y-8">
          <BiSolidBadgeCheck className="w-32 h-32 text-PRIMARY" />
          <p className="font-urbanist font-light">No Noise or Bias Detected</p>
        </div>
      )}
    </div>
  );
};

export default BiasCard;
