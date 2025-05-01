export const newOccurrence = (allDecisions, bias, noise) => {
  if (allDecisions.length === 0) {
    return [...bias, ...noise].map(item => ({
      message: `${item} was detected for the first time!`,
      type: "new"
    }));
  }

  const previousDecisions = allDecisions.slice(1);

  const pastBias = new Set(previousDecisions.flatMap(d => d.detectedBias?.map(b => b.bias) || []));
  const pastNoise = new Set(previousDecisions.flatMap(d => d.detectedNoise?.map(n => n.noise) || []));

  const newBiases = bias.filter(b => !pastBias.has(b));
  const newNoises = noise.filter(n => !pastNoise.has(n));

  return [...newBiases, ...newNoises].map(item => ({
    message: `${item} was detected for the first time!`,
    type: "new"
  }));
};

export const absentStreaks = (allDecisions, allBiases, allNoises) => {
  const streaks = [];

  const getStreak = (label, type) => {
    let streak = 0;
    for (let i = allDecisions.length - 1; i >= 0; i--) {
      const items = allDecisions[i][type] || [];
      const names = items.map(item => item.bias || item.noise);

      if (names.includes(label)) break;
      streak++;
    }

    return streak;
  };

  allBiases.forEach(b => {
    const streak = getStreak(b, "detectedBias");
    const prevDetected = allDecisions.some(d =>
      (d.detectedBias || []).some(x => x.bias === b)
    );
    if (prevDetected && streak >= 3) {
      streaks.push({ message: `${b} hasn't been detected in the last ${streak} decisions`, type: "absence-streak" });
    }
  });

  allNoises.forEach(n => {
    const streak = getStreak(n, "detectedNoise");
    const prevDetected = allDecisions.some(d =>
      (d.detectedNoise || []).some(x => x.noise === n)
    );
    if (prevDetected && streak >= 3) {
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

    const currentItems = new Set(allItems);
    Object.keys(streaks).forEach(item => {
      if (!currentItems.has(item)) streaks[item] = 0;
    });

    allItems.forEach(item => {
      streaks[item] = (streaks[item] || 0) + 1;
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

  for (const decision of allDecisions) {
    const items = decision[type] || [];
    items.forEach(({ bias, noise }) => {
      if (bias) counts[bias] = (counts[bias] || 0) + 1;
      if (noise) counts[noise] = (counts[noise] || 0) + 1;
    });
  }

  const maxCount = Math.max(0, ...Object.values(counts));

  return Object.entries(counts)
    .filter(([, count]) => count === maxCount && maxCount > 1)
    .map(([label]) => ({
      message: `${label} was the most frequently detected ${type === "detectedBias" ? "bias" : "noise"} in the last ${allDecisions.length} decisions`,
      type: "most-frequent"
    }));
};



