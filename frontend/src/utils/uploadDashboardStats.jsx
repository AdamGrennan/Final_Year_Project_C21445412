import { db } from "@/config/firebase";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";

export const uploadDashboardStats = async (userId) => {
  try {
    if (!userId) throw new Error("User is not defined.");

    const decisionsRef = collection(db, "judgement");
    const q = query(decisionsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No decisions found for this user.");
      return;
    }

    let totalDecisions = querySnapshot.size;
    let completedDecisions = 0;
    const biasCounts = {};
    const noiseCounts = {};

    querySnapshot.forEach((doc) => {
      const decision = doc.data();
      if (decision.isCompleted) completedDecisions++;

      if (Array.isArray(decision.detectedBias)) {
        decision.detectedBias.forEach(({ bias }) => {
          biasCounts[bias] = (biasCounts[bias] || 0) + 1;
        });
      }

      if (Array.isArray(decision.detectedNoise)) {
        decision.detectedNoise.forEach(({ noise }) => {
          noiseCounts[noise] = (noiseCounts[noise] || 0) + 1;
        });
      }
    });

    const mostFrequentBias =
      Object.keys(biasCounts).length > 0
        ? Object.keys(biasCounts).reduce((a, b) => (biasCounts[a] > biasCounts[b] ? a : b))
        : null;
    const mostFrequentNoise =
      Object.keys(noiseCounts).length > 0
        ? Object.keys(noiseCounts).reduce((a, b) => (noiseCounts[a] > noiseCounts[b] ? a : b))
        : null;

    const dashboardRef = doc(db, "dashboard", userId);
    await setDoc(
      dashboardRef,
      {
        userId: userId,
        totalDecisions,
        completedDecisions,
        biasCounts,
        noiseCounts,
        mostFrequentBias,
        mostFrequentNoise,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("Dashboard stats updated successfully!");

  } catch (error) {
    console.error("Error updating dashboard stats:", error);
  }
};
