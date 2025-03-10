import { db } from "@/config/firebase";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";

export const uploadDashboardStats = async (user) => {
  try {

    const decisionsRef = collection(db, "judgement");
    const q = query(decisionsRef, where("userId", "==", user.uid));

    const querySnapshot = await getDocs(q);
    const decisions = querySnapshot.docs.map((doc) => doc.data());

    if (decisions.length === 0) {
      console.log("No decisions found for this user.");
      return;
    }

    const biasCounts = {};
    const noiseCounts = {};
    let totalDecisions = 0;
    let completedDecisions = 0;

    decisions.forEach((decision) => {
      totalDecisions++;
      if (decision.isCompleted) completedDecisions++;

      if (decision.detectedBias) {
        decision.detectedBias.forEach((bias) => {
          biasCounts[bias] = (biasCounts[bias] || 0) + 1;
        });
      }

      if (decision.detectedNoise) {
        decision.detectedNoise.forEach((noise) => {
          noiseCounts[noise] = (noiseCounts[noise] || 0) + 1;
        });
      }
    });

    const mostFrequentBias = Object.keys(biasCounts).reduce((a, b) => (biasCounts[a] > biasCounts[b] ? a : b), null);
    const mostFrequentNoise = Object.keys(noiseCounts).reduce((a, b) => (noiseCounts[a] > noiseCounts[b] ? a : b), null);

    const dashboardStats = {
      userId: user.uid,
      totalDecisions,
      completedDecisions,
      biasCounts,
      noiseCounts,
      mostFrequentBias,
      mostFrequentNoise,
      updatedAt: serverTimestamp(),
    };

    const dashboardRef = doc(db, "dashboard", user.uid);
    await setDoc(dashboardRef, dashboardStats, { merge: true });

    console.log("Dashboard stats updated successfully!");

  } catch (error) {
    console.error("Error saving to dashboard:", error);
  }
};
