"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BsArrowRepeat } from "react-icons/bs";
import { MdKeyboardDoubleArrowUp, MdOutlineKeyboardDoubleArrowDown, MdNewReleases } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import { AiFillFire } from "react-icons/ai";
import useFetchTrends from "../../../utils/trendUtils/useTrendAnalysis";
import useTrendData from "@/hooks/useTrendData";

const Trends = ({ user, jid, bias, noise, isRevisited }) => {
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
    streak: <AiFillFire className="text-PRIMARY" />,
    "detection-streak": <BsArrowRepeat/>,
    "most-frequent": <FaCrown className="text-SECONDARY" />
  };

  return (
    <div>
      <ScrollArea>
        {displayTrends.length === 0 ? <p className="font-urbanist text-gray-500">No Trends Detected </p> :
          displayTrends.map((trend, index) => (
            <div key={index} className="w-full text-left flex flex-col items-center font-urbanist">
              <div className="flex justify-between items-center w-full px-2 py-1 rounded-md bg-gray-50 hover:bg-gray-100 transition">
                <p className="text-gray-700">{trend.message}</p>
                <span className="text-xl">{iconMap[trend.type]}</span>
              </div>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};

export default Trends;
