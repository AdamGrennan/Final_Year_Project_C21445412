"use client";
import { SuggestionsSidebar } from "@/components/report-components/SuggestionsSidebar";
import BarChart from "@/components/report-components/chart-components/BarChart";
import Trends from "@/components/report-components/trend-components/Trends";
import { useDecision } from '@/context/DecisionContext';
import { useUser } from '@/context/UserContext';
import { useState, useRef, useEffect } from "react";
import { Pagination, } from 'swiper/modules';
import InteractCard from "@/components/report-components/InteractCard";
import SwiperNavigation from "@/components/report-components/swiper-components/SwiperNavigation";
import useDecisionData from "@/utils/decisionUtils/useDecisionData";
import { uploadDashboardStats } from "@/utils/dashboardUtils/uploadDashboardStats";
import { useParams, useSearchParams } from "next/navigation";
import { query, collection, where, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";


import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import BiasCard from "@/components/report-components/BiasCard";

export default function Page() {
  const { detectedBias, detectedNoise, biasSources, noiseSources, advice } = useDecision();
  const { judgementId } = useParams();
  const { user } = useUser();
  const swiperRef = useRef(null);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [chatSummaries, setChatSummaries] = useState([]);
  const searchParams = useSearchParams();
  const isRevisited = searchParams.get("revisited") === "true";
  useDecisionData(isRevisited);

  useEffect(() => {
    if (!isRevisited && user?.uid) {
      uploadDashboardStats(user.uid);
    }
  }, [isRevisited, user]);
  

  useEffect(() => {
    const getSummaries = async () => {
      try {
        const judgeRef = doc(db, "judgement", judgementId);
        const snapshot = await getDoc(judgeRef);

        let latestSummary = "No summary available";
        if (snapshot.exists()) {
          const data = snapshot.data();
          latestSummary = data.chatSummary || "No summary available";
          console.log("Retrieved current chat summary:", latestSummary);
        } else {
          console.error("No chat summary found for current judgment.");
        }

        const judgmentsQuery = query(
          collection(db, "judgement"),
          where("userId", "==", user.uid),
          where("isCompleted", "==", true),
          orderBy("updatedAt", "desc"),
          limit(6)
        );

        const judgmentsSnapshot = await getDocs(judgmentsQuery);

        const previousChatSummaries = [];
        judgmentsSnapshot.forEach((doc) => {
          const judgmentData = doc.data();
          if (doc.id !== judgementId && judgmentData.chatSummary) {
            previousChatSummaries.push(judgmentData.chatSummary);
          }
        });

        const finalPreviousSummaries = previousChatSummaries.slice(0, 5);

        console.log("Retrieved previous 5 chat summaries:", finalPreviousSummaries);

        setChatSummaries({ currentChatSummary: latestSummary, previousChatSummaries: finalPreviousSummaries });

      } catch (error) {
        console.error("Error fetching chat summaries:", error);
      }
    };

    if (judgementId) {
      getSummaries();
    }
  }, [judgementId]);

  return (
    <div className="container bg-gray-50">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setIsLastSlide(swiper.isEnd);
          setIsFirstSlide(swiper.activeIndex === 0);
        }}
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{
          clickable: true
        }}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="w-full text-center bg-gray-50">
            <h2 className="font-urbanist text-2xl font-semibold text-PRIMARY">
              Decision Analysis
            </h2>
          </div>
          <div className="bg-gray-50 h-auto flex flex-col md:flex-row items-start justify-between p-8 space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full md:w-3/3 h-[375px] max-h-[375px] bg-white rounded-lg shadow-md p-6 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-SECONDARY scrollbar-track-GRAAY">
              <h3 className="text-center font-urbanist text-black text-base font-semibold border-b border-PRIMARY pb-2">
                Detected Noise & Bias
              </h3>
              <BiasCard bias={detectedBias}
                noise={detectedNoise}
                biasSources={biasSources}
                noiseSources={noiseSources}
                advice={advice} />
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="w-full text-center bg-gray-50">
            <h2 className="font-urbanist text-2xl font-semibold text-PRIMARY">
             Decision Analysis
            </h2>
            <div className="bg-gray-50 h-auto flex flex-col md:flex-row items-start justify-between p-8 space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full md:w-1.5/3 h-[375px] bg-white rounded-lg shadow-md p-6 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-SECONDARY scrollbar-track-GRAAY">
              <h3 className="text-center font-urbanist text-black text-base font-semibold border-b border-PRIMARY pb-2">
               Detection Frequency
              </h3>
              <BarChart bias={detectedBias} noise={detectedNoise}/>
            </div> 
            <div className="w-full md:w-1.5/3 h-[375px] bg-white rounded-lg shadow-md p-6 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-SECONDARY scrollbar-track-GRAAY">
              <h3 className="text-center font-urbanist text-black text-base font-semibold border-b border-PRIMARY pb-2">
               Decision Suggestions
              </h3>
              <SuggestionsSidebar chatSummaries={chatSummaries} judgementId={judgementId} isRevisited={isRevisited}/>
            </div> 
          </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="w-full text-center bg-gray-50">
            <h2 className="font-urbanist text-2xl font-semibold text-PRIMARY">
             Decision Analysis
            </h2>
          </div>
          <div className="bg-gray-50 flex flex-col md:flex-row items-start justify-between w-full space-y-6 md:space-y-0 md:space-x-6 mt-8">
            <div className="w-full md:w-2/3 h-[375px] bg-white rounded-lg shadow-md p-6 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-SECONDARY scrollbar-track-GRAAY">
              <h3 className="bg-white text-center font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                Decision Trends
              </h3>
              <Trends user={user} jid={judgementId} bias={detectedBias} noise={detectedNoise} isRevisited={isRevisited}/>
            </div>
            <div className="w-full md:w-1/3 h-[375px] bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="text-center font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                Your Feedback
              </h3>
              <InteractCard user={user} decision={judgementId} isRevisited={isRevisited}/>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <SwiperNavigation swiperRef={swiperRef} isLastSlide={isLastSlide} isFirstSlide={isFirstSlide} />
    </div>

  );
}

