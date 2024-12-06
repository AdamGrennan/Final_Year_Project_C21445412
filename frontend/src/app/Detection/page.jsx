"use client"
import { useEffect, useState } from "react";

import * as React from "react";
import Chat from "@/components/Chat";
import FeedSideBar from "@/components/Feedback-sidebar";

export default function Page(){
    const[bias, setBias] = useState([]);
    const[noise, setNoise] = useState([]);

    return(
        <div className="flex flex-row w-full h-screen">
      <div className="flex-1">
        <Chat/>
      </div>
      <FeedSideBar bias={bias} noise={noise} />
    </div>
    );
}