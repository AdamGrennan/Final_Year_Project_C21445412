"use client";
import Snapshot from "@/components/report_components/chart-components/Snapshot";
import SummarySideBar from "@/components/report_components/SummarySidebar";
import Trends from "@/components/report_components/trend-components/Trends";
import { useDecision } from '@/context/DecisionContext';
import { useUser } from '@/context/UserContext';
import { useState, useRef } from "react";
import { Pagination, } from 'swiper/modules';
import InteractCard from "@/components/report_components/InteractCard";
import SwiperNavigation from "@/components/report_components/swiper_components/SwiperNavigation";
import useDecisionData from "@/hooks/useDecisionData";
import { useParams } from "next/navigation";

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import BiasCard from "@/components/report_components/BiasCard";

export default function Page() {
  useDecisionData();

  const { detectedBias,
    detectedNoise, setDetectedNoise, setDetectedBias,
    biasSources, noiseSources,
    setBiasSources, setNoiseSources, advice } = useDecision();

  const { judgementId } = useParams();
  const { user } = useUser();
  const swiperRef = useRef(null);
  const [isLastSlide, setIsLastSlide] = useState(false);

  return (
    <div className="container">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setIsLastSlide(swiper.isEnd)}
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{
          clickable: true
        }}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="w-full text-center">
            <h2 className="font-urbanist text-2xl font-semibold text-PRIMARY">
              Decision Analysis
            </h2>
          </div>
          <div className="h-auto flex flex-col md:flex-row items-start justify-between p-8 space-y-8 md:space-y-0 md:space-x-8 bg-white">
            <div className="w-full md:w-2/3 h-[375px] max-h-[375px] bg-white rounded-lg shadow-md p-6 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-SECONDARY scrollbar-track-GRAAY">
              <h3 className="text-center font-urbanist text-black text-base font-semibold border-b border-PRIMARY pb-2">
                Detected Noise & Bias
              </h3>
              <BiasCard bias={detectedBias} 
              noise={detectedNoise} 
              biasSources={biasSources} 
              noiseSources={noiseSources}
              advice={advice}/>
            </div>
            <div className="w-full md:w-1/3 h-[375px] bg-white rounded-lg shadow-md p-6">
              <h3 className="text-center font-urbanist text-black text-base font-semibold border-b border-PRIMARY pb-2">
                Insight Graphs
              </h3>
              <Snapshot bias={detectedBias} noise={detectedNoise} />
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="w-full text-center">
            <h2 className="font-urbanist text-2xl font-semibold text-PRIMARY">
              Trends and Patterns
            </h2>
            <div className="h-auto flex flex-col md:flex-row items-start justify-between p-8 space-y-8 md:space-y-0 md:space-x-8 bg-white">
              <div className="w-full md:w-3/3 h-[375px] bg-white rounded-lg shadow-md p-6 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-SECONDARY scrollbar-track-GRAAY">
                <h3 className="font-urbanist text-black text-base font-semibold border-b border-PRIMARY pb-2">
                  Key Trends
                </h3>
                <Trends user={user} jid={judgementId} bias={detectedBias} noise={detectedNoise} />
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="w-full text-center">
          <h2 className="font-urbanist text-2xl font-semibold text-PRIMARY">
              Trends and Patterns
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-6 md:space-y-0 md:space-x-6 mt-8">
            <div className="w-full md:w-1/2 h-[375px] bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="text-center font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
              Reflections & Growth
              </h3>
              <SummarySideBar />
            </div>
            <div className="w-full md:w-1/2 h-[375px] bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="text-center font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                Your Feedback
              </h3>
              <InteractCard/>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <SwiperNavigation swiperRef={swiperRef} isLastSlide={isLastSlide} />
    </div>

  );
}

