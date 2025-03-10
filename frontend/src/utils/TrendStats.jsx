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

export const percentageChange = (allDecisions, key) => {
  if (allDecisions.length < 3) return [];

  const countOccurrences = (decisions) =>
    decisions.reduce((acc, decision) => {
      (decision[key] || []).forEach(item => {
        const name = item.bias || item.noise;
        if (name) acc[name] = (acc[name] || 0) + 1;
      });
      return acc;
    }, {});

  const mid = Math.floor(allDecisions.length / 2);
  const pastDecisions = allDecisions.slice(0, mid);
  const recentDecisions = allDecisions.slice(mid);

  const recentCounts = countOccurrences(recentDecisions);
  const pastCounts = countOccurrences(pastDecisions);

  return Object.keys({ ...recentCounts, ...pastCounts }).map(biasOrNoise => {
    const prevCount = pastCounts[biasOrNoise] || 0;
    const currentCount = recentCounts[biasOrNoise] || 0;

    let change = 0;

    if (prevCount === 0 && currentCount === 0) return null;

    if (prevCount > 0 && currentCount === 0) {
      change = -100;
    } 
    else if (prevCount === 0 && currentCount > 0) {
      change = ((currentCount - prevCount) / (prevCount + 1)) * 100; 
    } 
    else {
      change = ((currentCount - prevCount) / prevCount) * 100;
    }

    return {
      message: `${biasOrNoise} ${change > 0 ? "increased" : "decreased"} by ${Math.abs(change.toFixed(1))}%`,
      type: change > 0 ? "increase" : "decrease"
    };
  }).filter(Boolean); 
};



export const decisionStreaks = (allDecisions, allBiases, allNoises) => {
  if (allDecisions.length < 3) return [];

  allDecisions.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
  const lastThreeDecisions = allDecisions.slice(-3);

  const pastBiases = new Set(lastThreeDecisions.flatMap(d => d.detectedBias?.map(b => b.bias) || []));
  const pastNoises = new Set(lastThreeDecisions.flatMap(d => d.detectedNoise?.map(n => n.noise) || []));

  return [
    ...allBiases.filter(b => !pastBiases.has(b)).map(b => ({ message: `${b} has NOT been detected in the last 3 decisions!`, type: "streak" })),
    ...allNoises.filter(n => !pastNoises.has(n)).map(n => ({ message: `${n} has NOT been detected in the last 3 decisions!`, type: "streak" }))
  ];
};
