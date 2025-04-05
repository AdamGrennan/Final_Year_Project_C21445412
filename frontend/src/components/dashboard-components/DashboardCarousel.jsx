"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DecisionStats } from "./DecisionStats";
import { RecentDecision } from "./RecentDecisions";

export const DashboardCarousel = ({ userId, total, pieData, topThemeWithBias, topThemeWithNoise, trendInsights, mostBiasedTime,
  noisiestTime }) => {

  return (
    <div>
      <h2 className="font-urbanist font-semibold mb-2 border-b-[2px] border-PRIMARY pb-1 w-40">
        Decision Statistics
      </h2>
      <div className="w-[620px] h-[410px] bg-white shadow-lg rounded-lg p-4 relative">
        <Carousel className="w-full h-full">
          <CarouselContent className="flex">
            <CarouselItem className="flex-shrink-0 w-full flex justify-center">
              <DecisionStats
                total={total}
                pieData={pieData}
                topThemeWithBias={topThemeWithBias}
                topThemeWithNoise={topThemeWithNoise}
                trendInsights={trendInsights}
                mostBiasedTime={mostBiasedTime}
                noisiestTime={noisiestTime}
              />
            </CarouselItem>
            <CarouselItem className="flex-shrink-0 w-full flex justify-center">
              <RecentDecision userId={userId} />
            </CarouselItem>
          </CarouselContent>
          <div className="absolute top-2 left-10">
            <CarouselPrevious className="bg-white hover:bg-gray-200 text-black py-2 px-3 rounded-full shadow-md" />
          </div>
          <div className="absolute top-2 right-10">
            <CarouselNext className="bg-white hover:bg-gray-200 text-black py-2 px-3 rounded-full shadow-md" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};
