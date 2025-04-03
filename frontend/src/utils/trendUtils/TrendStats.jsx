export const newOccurrence = (allDecisions, bias, noise) => {
  let detectedTrends = [];
  if (allDecisions.length === 0) {
    return [...bias, ...noise].map(item => ({ message: `${item} was detected for the first time!`, type: "new" }));
  }

  const pastBias = new Set(allDecisions.slice(1).flatMap(d => d.detectedBias?.map(b => b.bias) || []));
  const pastNoise = new Set(allDecisions.slice(1).flatMap(d => d.detectedNoise?.map(n => n.noise) || []));

  bias.forEach(b => { if (!pastBias.has(b)) detectedTrends.push({ message: `${b} was detected for the first time!`, type: "new" }); });
  noise.forEach(n => { if (!pastNoise.has(n)) detectedTrends.push({ message: `${n} was detected for the first time!`, type: "new" }); });

  return detectedTrends;
};

export const frequencyChange = (allDecisions, key) => {
  if (allDecisions.length < 4) return [];

  const countOccurrences = (decisions) =>
    decisions.reduce((acc, decision) => {
      (decision[key] || []).forEach(item => {
        const name = item.bias || item.noise;
        if (name) acc[name] = (acc[name] || 0) + 1;
      });
      return acc;
    }, {});

  const mid = Math.floor(allDecisions.length / 2);
  const past = allDecisions.slice(0, mid);
  const recent = allDecisions.slice(mid);

  const pastCounts = countOccurrences(past);
  const recentCounts = countOccurrences(recent);

  const messages = [];

  const allLabels = new Set([...Object.keys(pastCounts), ...Object.keys(recentCounts)]);

  allLabels.forEach(label => {
    const recentFreq = (recentCounts[label] || 0) / recent.length;
    const pastFreq = (pastCounts[label] || 0) / past.length;

    const diff = recentFreq - pastFreq;

    if (Math.abs(diff) < 0.1) return; 

    messages.push({
      message: `${label} is appearing in ${Math.round(recentFreq * 100)}% of recent decisions (was ${Math.round(pastFreq * 100)}%)`,
      type: diff > 0 ? "increase" : "decrease"
    });
  });

  return messages;
};


export const absentStreaks = (allDecisions, allBiases, allNoises) => {
  const streaks = [];

  const getStreak = (label, type) => {
    let streak = 0;
    for (let i = allDecisions.length - 1; i >= 0; i--) {
      const items = allDecisions[i][type]?.map(x => x[type === "detectedBias" ? "bias" : "noise"]) || [];
      if (items.includes(label)) break;
      streak++;
    }
    return streak;
  };

  allBiases.forEach(b => {
    const streak = getStreak(b, "detectedBias");
    if (streak >= 3) {
      streaks.push({ message: `${b} hasn't been detected in the last ${streak} decisions`, type: "absence-streak" });
    }
  });

  allNoises.forEach(n => {
    const streak = getStreak(n, "detectedNoise");
    if (streak >= 3) {
      streaks.push({ message: `${n} hasn't been detected in the last ${streak} decisions`, type: "absence-streak" });
    }
  });

  return streaks;
};

export const detectionStreaks = (allDecisions) => {
  const streaks = {};
  const results = [];

  for (let i = allDecisions.length - 1; i >= 0; i--) {
    const biases = allDecisions[i].detectedBias?.map(b => b.bias) || [];
    const noises = allDecisions[i].detectedNoise?.map(n => n.noise) || [];
    const allItems = [...biases, ...noises];

    allItems.forEach(item => {
      streaks[item] = (streaks[item] || 0) + 1;
    });

    Object.keys(streaks).forEach(item => {
      if (!allItems.includes(item)) delete streaks[item];
    });
  }

  Object.entries(streaks).forEach(([item, count]) => {
    if (count >= 3) {
      results.push({ message: `${item} has been detected in ${count} consecutive decisions`, type: "detection-streak" });
    }
  });

  return results;
};

export const topFrequentTrends = (allDecisions, type) => {
  const counts = {};

  allDecisions.forEach(d => {
    const items = d[type]?.map(x => x[type === "detectedBias" ? "bias" : "noise"]) || [];
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
  });

  const maxCount = Math.max(...Object.values(counts), 0);

  return Object.entries(counts)
    .filter(([, count]) => count === maxCount && maxCount > 1)
    .map(([label]) => ({
      message: `${label} was the most frequently detected ${type === "detectedBias" ? "bias" : "noise"} in the last ${allDecisions.length} decisions`,
      type: "most-frequent"
    }));
};


