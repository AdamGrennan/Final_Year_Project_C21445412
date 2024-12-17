"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';

import * as React from "react";
import Chat from "@/components/Chat";
import { Button } from "@/components/ui/button";

export default function Page(){
    const router = useRouter();
    const {judgementId} = useParams();

    const finalReport = () => {
      router.push('/Final_Report');
    };
  
    return(
        <div className="flex flex-row w-full h-screen">
      <div className="flex-1">
        <Chat judgementId={judgementId}/>
      </div>
      <Button onClick={finalReport} className="bg-PRIMARY text-white font-urbanist">Final Insights</Button>
    </div>
    );
}