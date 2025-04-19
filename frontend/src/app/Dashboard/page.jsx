"use client"
import { FrequentTable } from "@/components/dashboard-components/FrequentTable";
import { DashboardCarousel } from "@/components/dashboard-components/DashboardCarousel";
import { PersonaType } from "@/components/dashboard-components/PersonaType";
import { useUser } from "@/context/UserContext";
import { getDashboard } from "@/utils/dashboardUtils/getDashboard";
import { useEffect, useState } from "react";


export default function Page() {
  const { user } = useUser();
  const [total, setTotal] = useState(0);
  const [mostFrequentBias, setMostFrequentBias] = useState("");
  const [mostFrequentNoise, setMostFrequentNoise] = useState("");
  const [biasCounts, setBiasCounts] = useState([]);
  const [noiseCounts, setNoiseCounts] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [trendInsights, setTrendInsights] = useState([]);
  const [biasTheme, setBiasTheme] = useState("");
  const [noiseTheme, setNoiseTheme] = useState("");
  const [mostBiasedTime, setMostBiasedTime] = useState("");
  const [noisiestTime, setNoisiestTime] = useState("");
  const [insights, setInsights] = useState("");

  useEffect(() => {
    if (user) {
      getDashboard(user).then((data) => {
        setTotal(data.totalDecisions);
        setMostFrequentBias(data.mostFrequentBias);
        setMostFrequentNoise(data.mostFrequentNoise);
        setBiasCounts(data.biasCounts);
        setNoiseCounts(data.noiseCounts);
        setTrendInsights(data.trendInsights);
        setBiasTheme(data.topThemeWithBias);
        setNoiseTheme(data.topThemeWithNoise);
        setMostBiasedTime(data.mostBiasedTime);
        setNoisiestTime(data.noisiestTime);
        setInsights(data.insights);
        
        const combinedPieData = [
          ...Object.entries(data.biasCounts || {}).map(([name, value]) => ({
            name,
            value: Number(value),
            type: "Bias",
          })),
          ...Object.entries(data.noiseCounts || {}).map(([name, value]) => ({
            name,
            value: Number(value),
            type: "Noise",
          })),
        ];


        setPieData(combinedPieData);
      });
    }
  }, [user]);

  return (
    <div className="grid grid-cols-3 gap-6 w-full px-6 pt-4">
      <div className="col-span-1 flex flex-col">
        <FrequentTable userId={user.uid} />
        <div className="mt-10">
          <PersonaType total={total} bias={mostFrequentBias} noise={mostFrequentNoise} />
        </div>
      </div>

      <div className="col-span-2 flex justify-end">
        <DashboardCarousel userId={user.uid}
          total={total} pieData={pieData}
          topThemeWithBias={biasTheme} topThemeWithNoise={noiseTheme}
          trendInsights={trendInsights} mostBiasedTime={mostBiasedTime}
          noisiestTime={noisiestTime} insights={insights} />
      </div>
    </div>
  );
};

