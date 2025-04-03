import { db } from "@/config/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

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
    const biasCounts = dashboardData.biasCounts || {};
    const noiseCounts = dashboardData.noiseCounts || {};
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

      const time = getTime(decision.createdAt);

      if (time) {
        if (Array.isArray(decision.detectedBias) && decision.detectedBias.length > 0) {
          biasTimes[time] = (biasTimes[time] || 0) + 1;
        }

        if (Array.isArray(decision.detectedNoise) && decision.detectedNoise.length > 0) {
          noiseTimes[time] = (noiseTimes[time] || 0) + 1;
        }
      }

      const decisionId = doc.id;

      if (processedDecisionIds.includes(decisionId)) return;

      totalDecisions++;
      newDecisionIds.push(decisionId);

      if (decision.isCompleted) completedDecisions++;

      if (Array.isArray(decision.detectedBias)) {
        decision.detectedBias.forEach((item) => {
          if (typeof item === "object" && typeof item.bias === "string") {
            const biasLabel = item.bias.trim();
            if (biasLabel) {
              biasCounts[biasLabel] = (biasCounts[biasLabel] || 0) + 1;
            }
          }
        });
      }

      if (Array.isArray(decision.detectedNoise)) {
        decision.detectedNoise.forEach((item) => {
          if (typeof item === "object" && typeof item.noise === "string") {
            const noiseLabel = item.noise.trim();
            if (noiseLabel) {
              noiseCounts[noiseLabel] = (noiseCounts[noiseLabel] || 0) + 1;
            }
          }
        });
      }

      const theme = decision.theme || "Unknown";

      if (theme) {
        if (Array.isArray(decision.detectedBias) && decision.detectedBias.length > 0) {
          biasThemes[theme] = (biasThemes[theme] || 0) + 1;
        }

        if (Array.isArray(decision.detectedNoise) && decision.detectedNoise.length > 0) {
          noiseThemes[theme] = (noiseThemes[theme] || 0) + 1;
        }

      }

    });
    if (newDecisionIds.length === 0) {
      return;
    }

    let mostFrequentBias = null;
    let highestBiasCount = 0;
    for (const bias of Object.keys(biasCounts)) {
      if (biasCounts[bias] > highestBiasCount) {
        highestBiasCount = biasCounts[bias];
        mostFrequentBias = bias;
      }
    }

    let mostFrequentNoise = null;
    let highestNoiseCount = 0;
    for (const noise of Object.keys(noiseCounts)) {
      if (noiseCounts[noise] > highestNoiseCount) {
        highestNoiseCount = noiseCounts[noise];
        mostFrequentNoise = noise;
      }
    }

    let topThemeWithBias = null;
    let maxBiasThemeCount = 0;
    for (const theme in biasThemes) {
      if (biasThemes[theme] > maxBiasThemeCount) {
        maxBiasThemeCount = biasThemes[theme];
        topThemeWithBias = theme;
      }
    }

    let topThemeWithNoise = null;
    let maxNoiseThemeCount = 0;
    for (const theme in noiseThemes) {
      if (noiseThemes[theme] > maxNoiseThemeCount) {
        maxNoiseThemeCount = noiseThemes[theme];
        topThemeWithNoise = theme;
      }
    }

    const getMaxKey = (obj) =>
      Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b), "None");

    const mostBiasedTime = getMaxKey(biasTimes);
    const noisiestTime = getMaxKey(noiseTimes);

    const updatedDecisionIds = [...processedDecisionIds, ...newDecisionIds];

    await setDoc(
      dashboardRef,
      {
        userId: userId,
        totalDecisions,
        completedDecisions,
        biasCounts,
        noiseCounts,
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
