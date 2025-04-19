"use client"

import React from "react";
import BiasDoughnutChart from "@/components/report-components/chart-components/BiasDoughnutChart";
import NoiseDoughnutChart from "./NoiseDoughnutChart";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "../../ui/card";

const Snapshot = ({ bias, noise }) => {

    return (
        <div className="w-[250px]">

            <Carousel className="w-full max-w-m">
                <CarouselContent>
                    <CarouselItem>
                        <div className="p-1">
                            <Card className="shadow-none border-none">
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <BiasDoughnutChart bias={bias} />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="p-1">
                            <Card className="shadow-none border-none">
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <NoiseDoughnutChart noise={noise} />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <div className="absolute bottom-[90%] -translate-y-1/2 w-full flex justify-between px-12">
                    <CarouselPrevious className="bg-white hover:bg-white text-black py-2 px-4 rounded-full transition relative mr-8" />
                    <CarouselNext className="bg-white hover:bg-white text-black py-2 px-4 rounded-full transition relative ml-8" />
                </div>
            </Carousel>
        </div>
    );
}; 

export default Snapshot;