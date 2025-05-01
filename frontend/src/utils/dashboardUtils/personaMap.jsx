import { LuBicepsFlexed } from "react-icons/lu";
import { PiCloudRainFill } from "react-icons/pi";
import { BsFillCloudLightningRainFill } from "react-icons/bs";
import { FaScaleBalanced, FaEyeSlash, FaMasksTheater } from "react-icons/fa6";
import { FaRegTired } from "react-icons/fa";
import { GiNewspaper, GiCompass, GiBigWave, GiBullseye, GiAnchor, GiPerspectiveDiceSixFacesOne, GiStrong } from "react-icons/gi";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { WiDayRainWind } from "react-icons/wi";

const personaMap = {
  "Overconfidence Bias|N/A": {
    type: "Confident Thinker",
    description: "You tend to trust your instincts and are confident in your decisions. Watch out for overconfidence in tough calls.",
    icon: <LuBicepsFlexed className="text-3xl" />
  },
  "Confirmation Bias|N/A": {
    type: "Belief Seeker",
    description: "You instinctively seek information that supports your beliefs. Acknowledging this can open the door to broader perspectives.",
    icon: <FaEyeSlash className="text-3xl" />
  },
  "Anchoring Bias|N/A": {
    type: "First Impression Thinker",
    description: "Your initial information carries strong weight in your decisions. Be mindful of how this anchor shapes your conclusions.",
    icon: <GiAnchor className="text-3xl" />
  },
  "Recency Bias|N/A": {
    type: "Recent Influencer",
    description: "You prioritize the latest info or events. While being up-to-date is useful, sometimes long-term patterns matter more.",
    icon: <GiNewspaper className="text-3xl" />
  },
  "N/A|Level Noise": {
    type: "Rigid Judge",
    description: "You tend to decide in a consistent but possibly inflexible way. This can be good or bad depending on context—awareness is key.",
    icon: <FaScaleBalanced className="text-3xl" />
  },
  "N/A|Occasion Noise": {
    type: "Mood-Based Thinker",
    description: "Your decisions change based on timing, energy, or how you're feeling. This may reduce reliability, so it helps to pause and check.",
    icon: <PiCloudRainFill className="text-3xl" />
  },
  "N/A|Pattern Noise": {
    type: "Unpredictable Reactor",
    description: "Your decisions seem inconsistent. Reflect on what’s changing each time, your reasoning may be shifting without you noticing.",
    icon: <FaMasksTheater className="text-3xl" />
  },
  "Overconfidence Bias|Level Noise": {
    type: "Overconfident Consistent",
    description: "You're confident in your choices and tend to judge consistently, though you may lean too harsh or too lenient.",
    icon: <GiBullseye className="text-3xl" />
  },
  "Overconfidence Bias|Occasion Noise": {
    type: "Overconfident Reactor",
    description: "You project confidence, but your certainty can waver with your energy, stress, or the timing of a decision.",
    icon: <GiStrong className="text-3xl" />
  },
  "Overconfidence Bias|Pattern Noise": {
    type: "Overconfident Wildcard",
    description: "You're confident, but your decisions can be unpredictable and don't always follow the facts.",
    icon: <GiPerspectiveDiceSixFacesOne className="text-3xl" />
  },

  "Confirmation Bias|Level Noise": {
    type: "Confirmation Seeker",
    description: "You consistently seek out info that supports your views, even if that leads to repetitive blind spots.",
    icon: <MdOutlineVisibilityOff  className="text-3xl" />
  },
  "Confirmation Bias|Occasion Noise": {
    type: "Swayed Thinker",
    description: "You tend to follow your beliefs, but your mood or energy levels can influence how you decide.",
    icon: <FaRegTired className="text-3xl" />
  },
  "Confirmation Bias|Pattern Noise": {
    type: "Selective Reactor",
    description: "You stick to your beliefs, but how they shape your decisions changes unpredictably.",
    icon: <FaMasksTheater className="text-3xl" />
  },

  "Anchoring Bias|Level Noise": {
    type: "Anchored Thinker",
    description: "You're consistent, but often locked into your first impression on decisions.",
    icon: <GiAnchor className="text-3xl" />
  },
  "Anchoring Bias|Occasion Noise": {
    type: "Flexible Thinker",
    description: "You’re often influenced by first impressions, though how much varies with your mood or environment.",
    icon: <GiBigWave className="text-3xl" />
  },
  "Anchoring Bias|Pattern Noise": {
    type: "Shifting Anchor",
    description: "You base decisions on different cues each time, which may not always lead to the best outcome.",
    icon: <GiCompass className="text-3xl" />
  },

  "Recency Bias|Level Noise": {
    type: "Trend Tracker",
    description: "You consistently favor recent events, even when a long-term view is more appropriate.",
    icon: <GiNewspaper className="text-3xl" />
  },
  "Recency Bias|Occasion Noise": {
    type: "The Reactionary",
    description: "You’re highly sensitive to what just happened, and your mood affects how you interpret it.",
    icon: <WiDayRainWind className="text-3xl" />
  },
  "Recency Bias|Pattern Noise": {
    type: "The Impulsive Reactor",
    description: "You respond to the latest events, but your reactions swing between extremes without a clear pattern.",
    icon: <BsFillCloudLightningRainFill className="text-3xl" />
  },
  "default": {
    type: "Balanced Decision-Maker",
    description: "You currently show no strong consistent bias or noise pattern.",
    icon: <FaScaleBalanced className="text-3xl" />
  }
};

export const getPersona = (bias, noise) => {
  const key = `${bias || "N/A"}|${noise || "N/A"}`;
  return personaMap[key] || personaMap["default"];
};
