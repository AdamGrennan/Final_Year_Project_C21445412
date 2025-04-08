import Lottie from "lottie-react";

export const EmojiPanel = ({ isThinking }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4">
    <div className="w-32 h-32 mb-2">
      {isThinking && (
        <Lottie
          path="/lottie/thinking.json"
          loop
          autoplay
        />
      )}
    </div>
  </div>
);
