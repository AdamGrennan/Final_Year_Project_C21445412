import { useState, useEffect } from "react";
import { collection, where, orderBy, limit, query, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { format } from "date-fns";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GiBrain } from "react-icons/gi";
import { fetchDashboardInsights } from "@/services/ApiService";

export const RecentDecision = ({ userId }) => {
  const [recentDecisions, setRecentDecisions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [gptInsight, setGptInsight] = useState("");


  useEffect(() => {
    const fetchRecentDecision = async () => {
      if (!userId) return;

      try {
        const q = query(
          collection(db, "judgement"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const decisions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecentDecisions(decisions);


          const data = await response.json();
          setGptInsight(data.summary || "");
        }
      } catch (error) {
        console.error("Error fetching recent decisions or insights:", error);
      }
    };

    fetchRecentDecision();
  }, [userId]);


  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-h-[360px] overflow-y-auto">
      <div className="flex items-center mb-4">
        <GiBrain className="text-pink-500 text-2xl mr-2" />
        <h2 className="text-lg font-urbanist font-semibold text-gray-800">Recent Decisions</h2>
      </div>
      {gptInsight && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-900 text-sm shadow">
          <strong>Sonus Reflection:</strong><br />
          {gptInsight}
        </div>
      )}

      {recentDecisions.length > 0 ? (
        <div className="space-y-4">
          {recentDecisions.map((decision, index) => {
            const { title, theme, details, detectedBias, detectedNoise, createdAt, advice, chatSummary } = decision;
            const isOpen = expandedIndex === index;

            return (
              <div key={index} className="border rounded-md p-4 bg-gray-50 shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-bold text-gray-700">{title}</h3>
                  <p className="text-xs text-gray-400">{createdAt?.toDate ? format(createdAt.toDate(), "PPP") : ""}</p>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold text-gray-700">Situation:</span>{" "}
                  {details?.situation || "—"}
                </p>

                <div className="flex flex-wrap gap-2 mt-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                    Theme: {theme}
                  </span>

                  {detectedBias?.length > 0 && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md font-medium">
                      Bias: {detectedBias.join(", ")}
                    </span>
                  )}

                  {detectedNoise && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md font-medium">
                      Noise: {Object.keys(detectedNoise).join(", ")}
                    </span>
                  )}

                </div>
                <div className="mt-3 text-right">
                  <button
                    className="font-urbanist text-sm text-SECONDARY hover:underline flex items-center gap-1 float-right"
                    onClick={() => setExpandedIndex(isOpen ? null : index)}
                  >
                    {isOpen ? (
                      <>
                        Hide Details <IoIosArrowUp />
                      </>
                    ) : (
                      <>
                        Show More <IoIosArrowDown />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No recent decisions found.</p>
      )}
    </div>
  );
};
