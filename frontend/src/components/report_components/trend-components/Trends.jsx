"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MdKeyboardDoubleArrowUp, MdOutlineKeyboardDoubleArrowDown, MdNewReleases } from "react-icons/md";
import { AiFillFire } from "react-icons/ai";
import { useSearchParams } from "next/navigation";
import useFetchTrends from "../../../hooks/useTrendAnalysis";
import useTrendData from "@/hooks/useTrendData";

const Trends = ({ user, jid, bias, noise }) => {
  const searchParams = useSearchParams();
  const isRevisited = searchParams.get("revisited") === "true";
  const { fetchedTrends } = useTrendData();
  const { fetchTrends, trends } = useFetchTrends(user, jid, bias, noise);
  const [displayTrends, setDisplayTrends] = useState([]);

  useEffect(() => {
    if (!isRevisited) {
      fetchTrends();
    }
  }, [user?.uid, jid, isRevisited]);

  useEffect(() => {
    setDisplayTrends(fetchedTrends);
  }, [fetchedTrends]);

  const iconMap = {
    new: <MdNewReleases className="text-SECONDARY" />,
    increase: <MdKeyboardDoubleArrowUp style={{ color: "red" }} />,
    decrease: <MdOutlineKeyboardDoubleArrowDown style={{ color: "green" }} />,
    streak: <AiFillFire className="text-PRIMARY" />
  };

  return (
    <div>
      <ScrollArea>
        {displayTrends.length === 0 ? <p>No Trends Detected </p> :
          displayTrends.map((trend, index) => (
            <div key={index} className="w-full text-left flex flex-col items-center font-urbanist">
              <div className="flex justify-between items-center font-urbanist">
                <p>{trend.message}</p>
                <span className="ml-4">{iconMap[trend.type]}</span>
              </div>

            </div>
          ))}
      </ScrollArea>
    </div>
  );
};

export default Trends;
