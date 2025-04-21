import { useState, useEffect } from "react";
import { collection, where, orderBy, limit, query, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { format } from "date-fns";
import { GiBrain } from "react-icons/gi";

export const RecentDecision = ({ userId, insights }) => {
  const [recentDecisions, setRecentDecisions] = useState([]);

  useEffect(() => {
    const fetchRecentDecision = async () => {
      if (!userId) return;

      try {
        const q = query(
          collection(db, "judgement"),
          where("userId", "==", userId),
          where("isCompleted", "==", true),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const decisions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecentDecisions(decisions);

        }
      } catch (error) {
        console.error("Error fetching recent decisions or insights:", error);
      }
    };

    fetchRecentDecision();
  }, [userId]);


  return (
    <div className="bg-white p-6 w-full max-h-[360px] overflow-y-auto font-urbanist">
      <div className="flex items-center mb-4">
        <GiBrain className="text-pink-500 text-2xl mr-2" />
        <h2 className="text-lg font-urbanist font-semibold text-gray-800">Recent Decisions</h2>
      </div>
  
      {insights && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-900 text-sm shadow">
          <strong className="block mb-1">Sonus Reflection:</strong>
          <ul className="list-disc pl-5 space-y-1">
            {insights
              .split("\n")
              .filter(line => line.trim() !== "")
              .map((point, idx) => (
                <li key={idx}>{point.replace(/^[-•\s]+/, "").trim()}</li>
              ))}
          </ul>
        </div>
      )}
      {recentDecisions.length > 0 ? (
        <div className="space-y-4">
          {recentDecisions.map((decision, index) => {
            const {
              title,
              theme,
              details,
              detectedBias,
              detectedNoise,
              createdAt,
            } = decision;
            return (
              <div
                key={index}
                className="border rounded-md p-4 bg-gray-50 shadow-sm font-urbanist">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-bold text-gray-700">{title}</h3>
                  <p className="text-xs text-gray-400">
                      {createdAt?.toDate()?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold text-gray-700">Situation:</span>{" "}
                  {details?.situation || "ERROR"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium bg-yellow-50 border border-yellow-300 rounded text-yellow-900">
                    Theme: {theme}
                  </span>
                  {detectedBias?.length > 0 && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md font-medium border border-orange-300 ">
                      Detected Bias: {detectedBias.map(b => b.bias).join(", ")}
                    </span>
                  )}
                  {detectedNoise && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded-md font-medium">
                       Detected Noise: {detectedNoise.map(n => n.noise).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No Recent Decisions Found.</p>
      )}
    </div>
  );  
};
