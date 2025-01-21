import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";

async function calculateTrends(userId) {
  const decisionsQuery = query(
    collection(db, "judgement"),
    where("userId", "==", userId),
    where("isCompleted", "==", true)

  );
  const snapshot = await getDocs(decisionsQuery);

  const biasCounts = {};
  const totalDecisions = snapshot.size;

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.biases) {
      data.biases.forEach((bias) => {
        biasCounts[bias] = (biasCounts[bias] || 0) + 1;
      });
    }
  });

  const trends = Object.keys(biasCounts).map((bias) => ({
    bias,
    percentage: Math.round((biasCounts[bias] / totalDecisions) * 100),
  }));

  return trends;
}
