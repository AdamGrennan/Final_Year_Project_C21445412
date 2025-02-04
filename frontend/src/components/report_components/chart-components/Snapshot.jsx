"use client"

import React from "react";
import BiasDoughnutChart from "@/components/report_components/chart-components/BiasDoughnutChart";
import NoiseDoughnutChart from "./NoiseDoughnutChart";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "../../ui/card";
import { CardContent } from "../../ui/card";

const Snapshot = ({ bias, noise}) => {

    return (
        <div className="w-[250px]">

            <Carousel className="w-full max-w-xs">
                <CarouselContent>
                        <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <BiasDoughnutChart bias={bias} />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <NoiseDoughnutChart noise={noise}/>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                </CarouselContent>
                <div className="absolute bottom-[90%] -translate-y-1/2 w-full flex justify-between px-12">
                    <CarouselPrevious className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full transition relative mr-8" />
                    <CarouselNext className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full transition relative ml-8" />
                </div>
            </Carousel>
        </div>
    );
};

export default Snapshot;