"use client";
import React from "react";
import { TiStarFullOutline } from "react-icons/ti";
import { MdOutlineSelfImprovement } from "react-icons/md";

const SummarySidebar = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full p-4 mb-4">
                <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold font-urbanist">Strengths</h3>
                    <TiStarFullOutline className="text-SECONDARY text-xl" />
                </div>
                <ul className="list-disc list-inside"></ul>
            </div>

            <div className="w-full p-4">
                <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold font-urbanist">Areas for Improvement</h3>
                    <MdOutlineSelfImprovement className="text-SECONDARY text-xl" />
                </div>
                <ul className="list-disc list-inside"></ul>
            </div>
        </div>
    );
};

export default SummarySidebar;
