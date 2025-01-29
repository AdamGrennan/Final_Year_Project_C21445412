"use client";
import Breakdown from "@/components/report_components/Breakdown";
import { useRouter } from "next/navigation";
import Snapshot from "@/components/report_components/chart-components/Snapshot";
import SummarySideBar from "@/components/report_components/SummarySidebar";
import Trends from "@/components/report_components/Trends";
import { useDecision } from '@/context/DecisionContext';
import { useJudgment } from "@/context/JudgementContext";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useUser } from '@/context/UserContext';
import { useEffect, useRef } from "react";
import { writeBatch, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useState } from "react";
import { Pagination, } from 'swiper/modules';
import { fetchPatternNoise } from "@/services/ApiService";
import PrevButton from "@/components/report_components/swiper_components/PreviousButton";
import NextButton from "@/components/report_components/swiper_components/NextButton";

import { Swiper, SwiperSlide } from 'swiper/react';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import BiasCard from "@/components/report_components/BiasCard";
import NoiseCard from "@/components/report_components/NoiseCard";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const { detectBias, detectNoise,
     breakdown, detectedBias,
      detectedNoise, occasionNoiseScore,
       patternNoiseScore, levelNoiseScore,
        setDetectedNoise, setDetectedBias,
      setOccasionNoiseScore, setPatterNoiseScore, setLevelNoiseScore } = useDecision();

  const [similiarDecisions, setSimilarDecisions] = useState([]);
  const router = useRouter();
  const { user } = useUser();
  const { judgmentData } = useJudgment();
  const swiperRef = useRef(null);
  const searchParams = useSearchParams();
  const isRevisited = searchParams.get("revisited") === "true";
  const { judgementId } = useParams();

  const openHome = () => {
    setTimeout(async () => {
      router.push('/Main');
      detectNoise(null);
      detectBias(null);
    }, 700);
  };

  useEffect(() => {
    const handleDecisionData = async () => {
      if (isRevisited) {
        console.log("db:", db);
        console.log("judgementId:", judgementId);

        try {
          const docRef = doc(db, "judgement", judgementId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const decisionData = docSnap.data();

            const detectedBiasesArray = Array.isArray(decisionData.detectedBias)
              ? Array.from(new Set(decisionData.detectedBias))
              : [];
            const detectedNoiseArray = Array.isArray(decisionData.detectedNoise)
              ? Array.from(new Set(decisionData.detectedNoise))
              : [];

            console.log("Unique Biases:", detectedBiasesArray);
            console.log("Unique Noises:", detectedNoiseArray);

            setDetectedBias(detectedBiasesArray);
            setDetectedNoise(detectedNoiseArray);
            setOccasionNoiseScore(decisionData.occasionNoiseScore);
            setPatternNoiseScore(decisionData.patternNoiseScore);
            setLevelNoiseScore(decisionData.levelNoiseScore);
            
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching revisited decision:", error);
        }
      } else {

        await finalReport();
      }
    };

    handleDecisionData();
  }, [isRevisited, judgementId]);



  const finalReport = async () => {
    const detectedBiasesArray = Array.from(new Set(detectedBias));
    const detectedNoiseArray = Array.from(new Set(detectedNoise));

    const patternNoiseData = await fetchPatternNoise(
      user.uid,
      judgementId,
      judgmentData.title,
      judgmentData.description,
      judgmentData.theme,
      "Breakdown",
      detectBias,
      detectedNoise
    );

    if (patternNoiseData) {
      const { pattern_noise_percentage, similarDecisions } = patternNoiseData;

      if (pattern_noise_percentage !== undefined) {
        console.log("Pattern Noise Score:", pattern_noise_percentage);
        detectNoise("Pattern Noise", pattern_noise_percentage);
      }
      if (similarDecisions && similarDecisions.length > 0) {
        console.log("Pattern Noise detected: Similar past decisions found.", similarDecisions);
        setSimilarDecisions(similarDecisions);
      } else {
        console.log("No Pattern Noise detected.");
        setSimilarDecisions([]);
      }
    }

    const judgeRef = doc(db, "judgement", judgementId);
    await updateDoc(judgeRef, {
      breakdown,
      detectedBias: detectedBiasesArray,
      detectedNoise: detectedNoiseArray,
      occasionNoiseScore: occasionNoiseScore,
      patternNoiseScore: patternNoiseScore,
      levelNoiseScore: levelNoiseScore,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <div className="container">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
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
            <p className="text-gray-600 text-base mt-1">
              Explore detected biases, noise, and key insights from your decisions.
            </p>
          </div>
          <div className="h-auto flex flex-col md:flex-row items-start justify-between p-8 space-y-8 md:space-y-0 md:space-x-8 bg-gray-50 rounded-lg shadow-lg">
            <div className="w-full md:w-1/3 h-[350px] bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                Detected Bias
              </h3>
              <BiasCard bias={detectedBias} />
            </div>
            <div className="w-full md:w-1/3  h-[350px] bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                Detected Noise
              </h3>
              <NoiseCard noise={detectedNoise} />
            </div>
            <div className="w-full md:w-1/3 h-[350px] bg-white rounded-lg shadow-md p-6">
              <h3 className="font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                Insight Graphs
              </h3>
              <Snapshot bias={detectedBias}
                occasionNoise={occasionNoiseScore}
                patternNoise={patternNoiseScore}
                levelNoise={levelNoiseScore} />
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="w-full text-center">
            <h2 className="font-urbanist text-2xl font-semibold text-PRIMARY">
              Trends and Patterns
            </h2>
            <p className="text-gray-600 text-base mt-2">
              A placeholder
            </p>
            <div className="h-auto flex flex-col md:flex-row items-start justify-between p-8 space-y-8 md:space-y-0 md:space-x-8 bg-gray-50 rounded-lg shadow-lg">
              <div className="w-full md:w-2/3 h-[350px] bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                  Key Trends
                </h3>
                <Trends similiarDecisions={similiarDecisions} user={user} bias={detectedBias} noise={detectedNoise}/>
              </div>
              <div className="w-full md:w-1/3  h-[350px] bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                 Charts
                </h3>

              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="w-full text-center">
            <h2 className="font-urbanist text-3xl font-semibold text-PRIMARY">
              End Slde
            </h2>
            <p className="text-gray-600 text-base mt-2">
              A placeholder
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-6 md:space-y-0 md:space-x-6 mt-8">
            <div className="w-full md:w-1/2 h-[350px] bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                Decision Breakdown
              </h3>
              <Breakdown breakdown={breakdown} />
            </div>
            <div className="w-full md:w-1/2 h-[350px] bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="font-urbanist text-black text-xl font-semibold border-b border-PRIMARY pb-2">
                Suggestions
              </h3>
              <SummarySideBar />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Button
              onClick={openHome}
              className="bg-PRIMARY text-white font-urbanist py-2 px-6 rounded-md transform transition-transform duration-300 active:scale-[1.1]"
            >
              Finish
            </Button>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="w-full flex justify-between items-center absolute top-20 px-4 z-10">
        <PrevButton swiperRef={swiperRef} />
        <NextButton swiperRef={swiperRef} />
      </div>
    </div>

  );
}

