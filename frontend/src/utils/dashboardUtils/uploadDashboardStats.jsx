import { db } from "@/config/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { newOccurrence, percentageChange, decisionStreaks } from "@/utils/TrendStats";

export const uploadDashboardStats = async (userId) => {
  try {
    if (!userId) throw new Error("User is not defined.");

    const decisionsRef = collection(db, "judgement");
    const q = query(decisionsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const allDecisions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const dashboardRef = doc(db, "dashboard", userId);
    const dashboardSnap = await getDoc(dashboardRef);
    const dashboardData = dashboardSnap.exists() ? dashboardSnap.data() : {};

    const biasThemes = {};
    const noiseThemes = {};
    let totalDecisions = dashboardData.totalDecisions || 0;
    let completedDecisions = dashboardData.completedDecisions || 0;
    const biasCounts = dashboardData.biasCounts || {};
    const noiseCounts = dashboardData.noiseCounts || {};
    const processedDecisionIds = dashboardData.processedDecisionIds || [];

    const newDecisionIds = [];

    querySnapshot.forEach((doc) => {
      const decision = doc.data();
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
      console.log(`BIAS THEME: ${theme} — COUNT: ${biasThemes[theme]}`);
      if (biasThemes[theme] > maxBiasThemeCount) {
        maxBiasThemeCount = biasThemes[theme];
        topThemeWithBias = theme;
      }
    }

    let topThemeWithNoise = null;
    let maxNoiseThemeCount = 0;
    for (const theme in noiseThemes) {
      console.log(`NOISE THEME: ${theme} — COUNT: ${noiseThemes[theme]}`);
      if (noiseThemes[theme] > maxNoiseThemeCount) {
        maxNoiseThemeCount = noiseThemes[theme];
        topThemeWithNoise = theme;
      }
    }
    
    const allBiasLabels = Object.keys(biasCounts);
    const allNoiseLabels = Object.keys(noiseCounts);

    const latestDecision = allDecisions.find(d => newDecisionIds.includes(d.id));
    const currentBiases = latestDecision?.detectedBias?.map(b => b.bias) || [];
    const currentNoises = latestDecision?.detectedNoise?.map(n => n.noise) || [];

    const trendMessages = [
      ...newOccurrence(allDecisions, currentBiases, currentNoises),
      ...percentageChange(allDecisions, "detectedBias"),
      ...percentageChange(allDecisions, "detectedNoise"),
      ...decisionStreaks(allDecisions, allBiasLabels, allNoiseLabels),
    ].slice(0, 3);

    const updatedDecisionIds = [...processedDecisionIds, ...newDecisionIds];

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
        topThemeWithBias,
        topThemeWithNoise,
        trendInsights: trendMessages,
        processedDecisionIds: updatedDecisionIds,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("Dashboard stats updated successfully!");
  } catch (error) {
    console.error("Error updating dashboard stats:", error);
  }
};
