import { useState, useEffect } from "react";
import { collection, where, orderBy, limit, query, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

export const RecentDecision = ({ userId }) => {
    const [recentDecisions, setRecentDecisions] = useState([]);
  
    useEffect(() => {
      const fetchRecentDecision = async () => {
        if (!userId) return;
  
        try {
          const q = query(
            collection(db, "judgement"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc"),
            limit(3)
          );
  
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setRecentDecisions(querySnapshot.docs.map(doc => doc.data()));
          }
        } catch (error) {
          console.error("Error fetching recent decision:", error);
        }
      };
  
      fetchRecentDecision();
    }, [userId]);
  
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 w-full">
        {recentDecisions.length > 0 ? (
          <div className="space-y-4">
            {recentDecisions.map((decision, index) => (
              <div key={index} className="border rounded p-3 bg-gray-50">
                <p className="text-gray-700 font-bold">{decision.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent decisions found.</p>
        )}
      </div>
    );
  };
  