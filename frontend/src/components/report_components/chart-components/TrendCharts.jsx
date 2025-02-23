"use client";

import React, { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "../../ui/card";
import { CardContent } from "../../ui/card";
import { query, getDocs, where, orderBy, collection } from "firebase/firestore";
import { db } from "@/config/firebase";

const TrendCharts = ({ user, bias, noise }) => {
    const [prevBias, setPrevBias] = useState([]);
    const [prevNoise, setPrevNoise] = useState([]);

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        if (user && user.uid) {
            try {
                const decisionsQuery = query(
                    collection(db, "judgement"),
                    where("userId", "==", user.uid),
                    where("isCompleted", "==", true),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(decisionsQuery);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const biasHistory = data.flatMap((d) => d.detectedBias || []);
                const noiseHistory = data.flatMap((d) => d.detectedNoise || []);

                setPrevBias(biasHistory);
                setPrevNoise(noiseHistory);

                console.log("Fetched decisions:", data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="w-full flex justify-center relative top-[-20px]">
            <Carousel className="w-[600px] border-none shadow-none bg-transparent relative">
                <CarouselContent>
                    <CarouselItem>
                        <div className="p-1">
                            <Card className="border-none shadow-none bg-transparent">
                                <CardContent className="p-4 flex items-center justify-center">
                                 
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>

                <div className="absolute bottom-[90%] -translate-y-1/2 w-full flex justify-between px-8">
                    <CarouselPrevious className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full transition relative left-8" />
                    <CarouselNext className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full transition relative right-8" />
                </div>
            </Carousel>
        </div>
    );
};

export default TrendCharts;
