"use client"
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "../ui/card";

export const DashboardCarousel = ({ data }) => {
  return (
    <div>
      <h2 className="font-urbanist font-semibold mb-2 border-b-[2px] border-PRIMARY pb-1 w-40">
        Most Frequent N&B
      </h2>
      <Carousel className="w-full max-w-m">
        <CarouselContent>
          <CarouselItem>
            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md w-[600px] h-[420px]">
              <Card className="shadow-none border-none">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="absolute bottom-[97%] -translate-y-1/2 w-full flex justify-between px-12">
          <CarouselPrevious className="bg-white hover:bg-white text-black py-2 px-4 rounded-full transition relative mr-8" />
          <CarouselNext className="bg-white hover:bg-white text-black py-2 px-4 rounded-full transition relative ml-8" />
        </div>
      </Carousel>
    </div>
  );
};



