"use client"

import React from "react";
import DoughnutChart from "@/components/report_components/chart-components/DoughnutChart";
import OccasionNoiseChart from "./OccasionNoiseChart";
import PatternNoiseChart from "./PatterNoiseChart";
import LevelNoiseChart from "./LevelNoiseChart";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "../../ui/card";
import { CardContent } from "../../ui/card";

const Snapshot = ({ bias, occasionNoise, patternNoise, levelNoise }) => {

    console.log("SNAPSHOT Occasion Noise:", occasionNoise);
    console.log("SNAPSHOT Pattern Noise:", patternNoise);
    console.log("SNAPSHOT Level Noise:", levelNoise);
    return (
        <div className="w-[250px]">

            <Carousel className="w-full max-w-xs">
                <CarouselContent>
                        <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <DoughnutChart bias={bias} />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <OccasionNoiseChart occasionNoise={occasionNoise}/>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <PatternNoiseChart patternNoise={patternNoise}/>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <LevelNoiseChart levelNoise={levelNoise}/>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                </CarouselContent>
                <div className="flex justify-between items-center mt-4">
                    <CarouselPrevious className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full transition relative mr-8" />
                    <CarouselNext className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full transition relative ml-8" />
                </div>
            </Carousel>
        </div>
    );
};

export default Snapshot;