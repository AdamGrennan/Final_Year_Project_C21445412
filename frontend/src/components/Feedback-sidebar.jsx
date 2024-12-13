"use client"
import { useRouter } from 'next/navigation';
import React from "react";

const FeedSideBar = ({bias = [], noise = []}) => {
  const router = useRouter();

  const finalReport = () => {
    router.push('/Final_Report');
  }

    return (
        <div className="w-1/4 p-4 border-l bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Detected Biases & Noises</h3>
          <div>
            <strong>Biases:</strong>
            <ul className="list-disc pl-4">
              {bias.length > 0 ? (
                bias.map((bias, index) => <li key={index}>{bias}</li>)
              ) : (
                <li>No biases detected</li>
              )}
            </ul>
          </div>
          <div className="mt-4">
            <strong>Noises:</strong>
            <ul className="list-disc pl-4">
              {noise.length > 0 ? (
                noise.map((noise, index) => <li key={index}>{noise}</li>)
              ) : (
                <li>No noises detected</li>
              )}
            </ul>
          </div>
          <button
            className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={finalReport}
          >
            View Final Report
          </button>
        </div>
      );
};

export default FeedSideBar;