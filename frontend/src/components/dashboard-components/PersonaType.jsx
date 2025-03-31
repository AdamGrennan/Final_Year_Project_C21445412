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
            <h2 className="text-2xl font-bold mb-2">Not Enough Decision Data Yet</h2>
            <p className="text-gray-600">
              Make at least 5 decisions to unlock a personalized profile based on your judgment patterns.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">{persona ? persona.type : "Loading..."}</h2>
            <p className="text-gray-600 mb-4">{persona ? persona.description : "Determining your decision-making style..."}</p>
          </>
        )}
      </div>
    </div>
  );
};
