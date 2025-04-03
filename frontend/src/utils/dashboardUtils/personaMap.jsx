import { GiBullseye } from "react-icons/gi";


export const personaMap = (bias, noise) => {
    if (bias === "Overconfidence Bias" && noise === "Level Noise") {
      return {
        type: "The Overconfident Consistent",
        description: "Highly confident and tends to be consistently lenient or strict in decision-making.",
        icon: <GiBullseye className="text-red-500 text-2xl"/>
      };
    }
    if (bias === "Overconfidence Bias" && noise === "Occasion Noise") {
      return {
        type: "The Overconfident Reactor",
        description: "Confident but sensitive to mood, time, or situation.",
      };
    }
    if (bias === "Overconfidence Bias" && noise === "Pattern Noise") {
      return {
        type: "The Overconfident Wildcard",
        description: "Confident with highly variable and unpredictable patterns.",
      };
    }
  
    if (!bias && noise === "Level Noise") {
      return { type: "The Steady-Handed Thinker", description: "Consistent, but maybe too rigid in approach." };
    }
    if (!bias && noise === "Occasion Noise") {
      return { type: "The Mood-Driven Planner", description: "Highly influenced by mood or external context." };
    }
    if (!bias && noise === "Pattern Noise") {
      return { type: "The Inconsistent Strategist", description: "Decision patterns shift unpredictably." };
    }

    return { type: "The Balanced Decision-Maker", description: "No dominant biases or noise detected so far." };
  };
  