"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BsArrowRepeat } from "react-icons/bs";
import { MdKeyboardDoubleArrowUp, MdOutlineKeyboardDoubleArrowDown, MdNewReleases } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import { AiFillFire } from "react-icons/ai";
import useFetchTrends from "../../../utils/trendUtils/useTrendAnalysis";
import { RxComponentNone } from "react-icons/rx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const Trends = ({ user, jid, bias, noise, isRevisited }) => {
  const { fetchTrends, trends } = useFetchTrends(user, jid, bias, noise, isRevisited);
  const [displayTrends, setDisplayTrends] = useState([]);

  useEffect(() => {
    if (isRevisited) {
      loadSavedTrends(); 
    } else {
      fetchTrends(); 
    }
  }, [user?.uid, jid, isRevisited]);
  

  useEffect(() => {
    if (!isRevisited) {
      setDisplayTrends(trends);
    }
  }, [trends, isRevisited]);
  

  const loadSavedTrends = async () => {
    if (!jid) return;
    const trendRef = doc(db, "trends", jid);
    const snapshot = await getDoc(trendRef);
    if (snapshot.exists()) {
      const trendData = snapshot.data();
      setDisplayTrends(trendData.trends || []);
    } else {
      console.warn("No trends found for this judgment.");
      setDisplayTrends([]);
    }
  };

  const iconMap = {
    new: <MdNewReleases className="text-SECONDARY" />,
    increase: <MdKeyboardDoubleArrowUp style={{ color: "red" }} />,
    decrease: <MdOutlineKeyboardDoubleArrowDown style={{ color: "green" }} />,
    streak: <AiFillFire className="text-PRIMARY" />,
    "detection-streak": <BsArrowRepeat />,
    "most-frequent": <FaCrown className="text-SECONDARY" />
  };

  return (
    <div>
      <ScrollArea>
        {displayTrends.length === 0 ?
           <div className="flex flex-col items-center mt-20">
            <span>
              <RxComponentNone className="text-gray-400 h-12 w-12" />
            </span>
            <p className="font-urbanist text-gray-400 italic">No Trends Detected </p>
          </div> :
          displayTrends.map((trend, index) => (
            <div key={index} className="w-full text-left flex flex-col items-center font-urbanist">
              <div className="flex justify-between items-center w-full px-2 py-1 rounded-md bg-gray-50 hover:bg-gray-100 transition">
                <p className="text-gray-700 text-base">{trend.message}</p>
                <span className="text-base">{iconMap[trend.type]}</span>
              </div>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};

export default Trends;
