import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export const EmojiPanel = ({ isThinking }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const path = isThinking ? "/lottie/thinking.json" : "/lottie/neutral.json";

    fetch(path)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Lottie animation", err));
  }, [isThinking]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 mb-2">
        {animationData && (
          <Lottie animationData={animationData} loop autoplay />
        )}
      </div>
    </div>
  );
};
