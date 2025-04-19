"use client";
import { useRouter } from 'next/navigation';
import JudgementButton from '@/components/main-components/JudgementButton';
import DashboardButton from '@/components/main-components/DashboardButton';
import { Label } from "@/components/ui/label"
import JudgementList from '@/components/main-components/JudgementList';
import { auth, db } from '@/config/firebase';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useDecision } from '@/context/DecisionContext';


export default function Page() {
  const router = useRouter();
  const { setDetectedNoise, setDetectedBias, setNoiseSources, setBiasSources, setAdvice } = useDecision();
  const [isModalOpen, setModalOpen] = useState(false);
  const welcomeMessage = (
    <>
      Welcome to Sonus! I help you reflect on your decisions by analyzing noise and bias, detecting patterns, and providing feedback to improve your decision-making skills over time.
      <br />
      <br />🧠 Receive insights on detected biases and potential noise.
      <br />📊 Review your decision trends and refine your approach.
      <br />🌟 Create new decision to get started.
    </>
  );

  const newJudgement = () => {
    router.push('/judgement-form');
  };

  const dashboard = () => {
    router.push('/dashboard');
  };

  useEffect(() => {
    const resetContext = () => {
      setDetectedBias([]);
      setDetectedNoise([]);
      setNoiseSources([]);
      setBiasSources([]);
      setAdvice("");
    };

    resetContext();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.newUser) {
            setModalOpen(true);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleModalClose = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { newUser: false }, { merge: true });
    }
    setModalOpen(false);
  };


  return (
    <div className="flex flex-1 flex-col h-full gap-4 p-4 bg-gray-50">
      <div className="flex gap-4">
        <div className="flex flex-col w-full md:w-1/2 pl-8">
          <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-semibold mb-2">Decision History</Label>
          <JudgementList />
        </div>


        <div className="flex items-end flex-col w-full md:w-1/2">
          <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-semibold mb-2 ">Tools</Label>
          <div className="flex flex-col space-y-[25px]">
            <JudgementButton onClick={newJudgement} />
            <DashboardButton onClick={dashboard} />
          </div>
        </div>
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg relative">
            <Button
              onClick={() => handleModalClose()}
              className="absolute top-3 right-3 text-gray-500 hover:text-PRIMARY transition"
              aria-label="Close modal"
            >
              ✖
            </Button>

            <div className="flex flex-col items-start">
              <h2 className="text-xl font-urbanist font-bold mb-2">Welcome!</h2>
              <span className="font-urbanist">{welcomeMessage}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}