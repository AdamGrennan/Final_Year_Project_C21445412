"use client";

import React from "react";
import LineChart from "./LineChart";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "../../ui/card";
import { CardContent } from "../../ui/card";
import BarChart from "./BarChart";

const TrendCharts = ({ bias, noise }) => {
    return (
        <div className="w-full flex justify-center relative top-[-40px]">
            <Carousel className="w-[700px] border-none shadow-none bg-transparent relative">
                <CarouselContent>
                    <CarouselItem>
                        <div className="p-1">
                            <Card className="border-none shadow-none bg-transparent">
                                <CardContent className="flex items-center justify-center p-6 bg-transparent border-none">
                                   <BarChart/>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>

                <div className="absolute bottom-[85%] -translate-y-1/2 w-full flex justify-between px-12">

                    <CarouselPrevious className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full transition relative left-8" />
                    <CarouselNext className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full transition relative right-8" />
                </div>
            </Carousel>
        </div>
    );
};

export default TrendCharts;
