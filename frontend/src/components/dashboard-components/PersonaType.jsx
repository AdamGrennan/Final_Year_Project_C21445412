import { useState, useEffect } from "react";
import { personaMap } from "@/utils/dashboardUtils/personaMap";

export const PersonaType = ({ total, bias, noise }) => {
  const [persona, setPersona] = useState(null);

  useEffect(() => {
    if (total >= 5) {
      const profile = personaMap(bias, noise);
      setPersona({ ...profile, bias, noise });
    }
  }, [total, bias, noise]);

  return (
    <div>
      <h2 className="font-urbanist font-semibold mb-2 border-b-[2px] border-PRIMARY pb-1 w-42">
        Decision-Making Style
      </h2>
      <div className="p-6 bg-white rounded-lg shadow-md text-center w-full mx-auto h-[200px]">
        {total < 5 ? (
          <>
            <h2 className="text-2xl font-bold font-urbanist mb-2">Not Enough Decision Data Yet</h2>
            <p className="text-gray-600 font-urbanist">
              Make at least 5 decisions to unlock a personalized profile based on your judgment patterns.
            </p>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-2">
              <span className="text-4xl mb-2">{persona?.icon}</span>
              <h2 className="text-2xl font-urbanist font-bold">
                {persona ? persona.type : "Loading..."}
              </h2>
              <p className="font-urbanist text-gray-600 mb-4">
                {persona ? persona.description : "Determining your decision-making style..."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
