import { db } from "@/config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export const uploadDashboardStats = async (userId) => {
  try {
    if (!userId) throw new Error("User is not defined.");

    const decisionsRef = collection(db, "judgement");
    const q = query(decisionsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const dashboardRef = doc(db, "dashboard", userId);
    const dashboardSnap = await getDoc(dashboardRef);
    const dashboardData = dashboardSnap.exists() ? dashboardSnap.data() : {};

    const biasThemes = dashboardData.biasThemes || {};
    const noiseThemes = dashboardData.noiseThemes || {};

    const biasTimes = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
    const noiseTimes = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };

    let totalDecisions = dashboardData.totalDecisions || 0;
    let completedDecisions = dashboardData.completedDecisions || 0;
    const biasCounts = dashboardData.biasDecisionCounts || {};
    const noiseCounts = dashboardData.noiseDecisionCounts || {};
    const processedDecisionIds = dashboardData.processedDecisionIds || [];

    const newDecisionIds = [];

    const getTime = (timestamp) => {
      const date = timestamp?.toDate?.();
      if (!date) return null;

      const hour = date.getHours();
      if (hour >= 6 && hour < 12) return "Morning";
      if (hour >= 12 && hour < 18) return "Afternoon";
      if (hour >= 18 && hour < 22) return "Evening";
      return "Night";
    };

    querySnapshot.forEach((doc) => {
      const decision = doc.data();
      const decisionId = doc.id;

      if (processedDecisionIds.includes(decisionId)) return;

      totalDecisions++;
      newDecisionIds.push(decisionId);

      if (decision.isCompleted) completedDecisions++;

      const uniqueBiases = new Set();
      const uniqueNoises = new Set();

      if (Array.isArray(decision.detectedBias)) {
        decision.detectedBias.forEach((item) => {
          if (typeof item === "object" && typeof item.bias === "string") {
            uniqueBiases.add(item.bias.trim());
          }
        });
      }

      if (Array.isArray(decision.detectedNoise)) {
        decision.detectedNoise.forEach((item) => {
          if (typeof item === "object" && typeof item.noise === "string") {
            uniqueNoises.add(item.noise.trim());
          }
        });
      }

      uniqueBiases.forEach((biasLabel) => {
        biasCounts[biasLabel] = (biasCounts[biasLabel] || 0) + 1;
      });

      uniqueNoises.forEach((noiseLabel) => {
        noiseCounts[noiseLabel] = (noiseCounts[noiseLabel] || 0) + 1;
      });

      const time = getTime(decision.createdAt);
      if (time) {
        if (uniqueBiases.size > 0) biasTimes[time]++;
        if (uniqueNoises.size > 0) noiseTimes[time]++;
      }

      const theme = decision.theme || "Unknown";
      if (theme) {
        if (uniqueBiases.size > 0) biasThemes[theme] = (biasThemes[theme] || 0) + 1;
        if (uniqueNoises.size > 0) noiseThemes[theme] = (noiseThemes[theme] || 0) + 1;
      }
    });

    if (newDecisionIds.length === 0) return;

    const getMostFrequent = (obj) => {
      let maxKey = null;
      let maxCount = 0;
      for (const key in obj) {
        if (obj[key] > maxCount) {
          maxCount = obj[key];
          maxKey = key;
        }
      }
      return maxKey;
    };

    const getMaxKey = (obj) =>
      Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b), "None");

    const mostFrequentBias = getMostFrequent(biasCounts);
    const mostFrequentNoise = getMostFrequent(noiseCounts);
    const topThemeWithBias = getMostFrequent(biasThemes);
    const topThemeWithNoise = getMostFrequent(noiseThemes);
    const mostBiasedTime = getMaxKey(biasTimes);
    const noisiestTime = getMaxKey(noiseTimes);

    const updatedDecisionIds = [...processedDecisionIds, ...newDecisionIds];

    await setDoc(
      dashboardRef,
      {
        userId: userId,
        totalDecisions,
        completedDecisions,
        biasDecisionCounts: biasCounts,
        noiseDecisionCounts: noiseCounts,
        biasThemes,
        noiseThemes,
        mostFrequentBias,
        mostFrequentNoise,
        topThemeWithBias,
        topThemeWithNoise,
        mostBiasedTime,
        noisiestTime,
        processedDecisionIds: updatedDecisionIds,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating dashboard stats:", error);
  }
};
