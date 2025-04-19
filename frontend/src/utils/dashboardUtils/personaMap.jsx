import { LuBicepsFlexed } from "react-icons/lu";
import { PiCloudRainFill } from "react-icons/pi";
import { BsFillCloudLightningRainFill } from "react-icons/bs";
import { FaScaleBalanced, FaEyeSlash, FaMasksTheater } from "react-icons/fa6";
import { FaRegTired } from "react-icons/fa";
import { GiNewspaper, GiCompass, GiBigWave, GiBullseye, GiAnchor, GiPerspectiveDiceSixFacesOne } from "react-icons/gi";

const personaMap = {
  "Overconfidence Bias|Level Noise": {
    type: "Overconfident Consistent",
    description: "You're confident in your choices and tend to judge consistently, though you may lean too harsh or too lenient.",
    icon: <GiBullseye className="text-3xl" />
  },
  "Overconfidence Bias|Occasion Noise": {
    type: "Overconfident Reactor",
    description: "You make confident decisions, but your judgment is influenced by mood, time, or energy levels.",
    icon: <LuBicepsFlexed className="text-3xl"/>
  },
  "Overconfidence Bias|Pattern Noise": {
    type: "Overconfident Wildcard",
    description: "You're confident, but your decisions can be unpredictable and don't always follow the facts.",
    icon: <GiPerspectiveDiceSixFacesOne className="text-3xl"/>
  },

  "Confirmation Bias|Level Noise": {
    type: "Confirmation Seeker",
    description: "You consistently seek out info that supports your views, even if that leads to repetitive blind spots.",
    icon: <FaEyeSlash className="text-3xl"/>
  },
"Confirmation Bias|Occasion Noise": {
  type: "Swayed Thinker",
  description: "You tend to follow your beliefs, but your mood or energy levels can influence how you decide.",
  icon: <FaRegTired className="text-3xl"/>
},
  "Confirmation Bias|Pattern Noise": {
    type: "Selective Reactor",
    description: "You favor your existing beliefs, but the way you apply them shifts from decision to decision.",
    icon: <FaMasksTheater className="text-3xl"/>
  },

  "Anchoring Bias|Level Noise": {
    type: "Anchored Thinker",
    description: "You're consistent, but often locked into your first impression on decisions.",
    icon: <GiAnchor className="text-3xl"/>
  },
  "Anchoring Bias|Occasion Noise": {
    type: "Flexible Thinker",
    description: "You rely on early info, but how strongly you do so changes based on context.",
    icon: <GiBigWave className="text-3xl"/>
  },
  "Anchoring Bias|Pattern Noise": {
    type: "Shifting Anchor",
    description: "You base decisions on different cues each time, which may not always lead to the best outcome.",
    icon: <GiCompass  className="text-3xl"/>
  },

  "Recency Bias|Level Noise": {
    type: "Trend Tracker",
    description: "You consistently favor recent events, even when a long-term view is more appropriate.",
    icon: <GiNewspaper className="text-3xl"/>
  },
  "Recency Bias|Occasion Noise": {
    type: "The Reactionary",
    description: "You’re highly sensitive to what just happened, and your mood affects how you interpret it.",
    icon: <PiCloudRainFill className="text-3xl"/>
  },
  "Recency Bias|Pattern Noise": {
    type: "The Impulsive Reactor",
    description: "You react to recent events, but how you react varies in unpredictable ways.",
    icon: <BsFillCloudLightningRainFill className="text-3xl"/>
  },
  "default": {
    type: "Balanced Decision-Maker",
    description: "You currently show no strong consistent bias or noise pattern.",
    icon: <FaScaleBalanced className="text-3xl"/>
  }
};

export const getPersona = (bias, noise) => {
  const key = `${bias}|${noise}`;
  return personaMap[key] || personaMap["default"];
};
