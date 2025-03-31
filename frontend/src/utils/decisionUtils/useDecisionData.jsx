import { useEffect } from "react";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useParams, useSearchParams } from "next/navigation";
import { db } from "@/config/firebase";
import { useDecision } from '@/context/DecisionContext';

const useDecisionData = (isRevisited) => {

  const { detectedBias,
    detectedNoise, setDetectedNoise, setDetectedBias,
    biasSources, noiseSources, setBiasSources,
    setNoiseSources, setAdvice, setStrengths, setImprovements } = useDecision();
  const { judgementId } = useParams();

  useEffect(() => {
    const fetchDecisionData = async () => {
      if (isRevisited) {

        try {
          const docRef = doc(db, "judgement", judgementId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const decisionData = docSnap.data();

            const detectedBiasesArray = Array.isArray(decisionData.detectedBias)
            ? decisionData.detectedBias.map(b => b.bias) 
            : [];
  
          const detectedNoiseArray = Array.isArray(decisionData.detectedNoise)
            ? decisionData.detectedNoise.map(n => n.noise) 
            : [];

            const biasSources = {}
            decisionData.detectedBias?.forEach((b) => {
              biasSources[b.bias] = b.sources || [];
            });

            const noiseSources = {}
            decisionData.detectedNoise?.forEach((n) => {
              noiseSources[n.noise] = n.sources || [];
            });
            const adviceData = decisionData.advice || {};
            const strengthData = decisionData.strengths || {};
            const improvementData = decisionData.improvements || {};

            setBiasSources({ ...biasSources });
            setNoiseSources({ ...noiseSources });
            setAdvice(adviceData);
            setDetectedBias([...detectedBiasesArray]);
            setDetectedNoise([...detectedNoiseArray]);
            setStrengths([...strengthData]); 
            setImprovements([...improvementData]); 

          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching revisited decision:", error);
        }
      } else {
        await finalReport();
      }
    };

    fetchDecisionData();
  }, [isRevisited, judgementId]);

  const finalReport = async () => {
    const detectedBiasesArray = Array.from(new Set(detectedBias));
    const detectedNoiseArray = Array.from(new Set(detectedNoise));

    const judgeRef = doc(db, "judgement", judgementId);
    await updateDoc(judgeRef, {
      detectedBias: detectedBiasesArray.map(b => ({ bias: b, sources: biasSources[b] || [] })),
      detectedNoise: detectedNoiseArray.map(n => ({ noise: n, sources: noiseSources[n] || [] })),
      updatedAt: serverTimestamp(),
    });
  };
};
export default useDecisionData;
