"use client";
import { useRouter } from 'next/navigation';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { doc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useDecision } from '@/context/DecisionContext';
import { Button } from '../ui/button';
import { IoTrashBin } from "react-icons/io5";

const JudgementList = () => {
  const router = useRouter();
  const [judgements, setJudgements] = useState([]);
  const { user } = useUser();
  const [filter, setFilter] = useState(true);
  const { detectedBias, detectedNoise } = useDecision();

  const openDecision = (judgementId, isCompleted) => {
    if (isCompleted) {
      router.push(`/Final_Report/${judgementId}?revisited=true`);
    } else {
      router.push(`/Chat_Page/${judgementId}`);
    }
  };

  const handleDelete = (judgementId) => {
    try {
      setTimeout(async () => {
        const chatQuery = query(collection(db, "chat"), where("judgementId", "==", judgementId));
        const trendQuery = query(collection(db, "trends"), where("jid", "==", judgementId));
        const chatDocs = await getDocs(chatQuery);
        const trendDocs = await getDocs(trendQuery);

        const deleteChats = chatDocs.docs.map((chatDoc) => deleteDoc(chatDoc.ref));
        const deleteTrends = trendDocs.docs.map((trendDoc) => deleteDoc(trendDoc.ref));
        await Promise.all(deleteChats, deleteTrends);

        const judgeRef = doc(db, "judgement", judgementId);
        await deleteDoc(judgeRef);
        console.log("Decision deleted successfully.");
        fetchJudgements();
      }, 700);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJudgements();
  }, [user, filter]);

  const fetchJudgements = async () => {
    if (user && user.uid) {
      try {
        console.log("Fetching judgements:", filter, "for userId:", user.uid);
        const judgementsQuery = query(
          collection(db, "judgement"),
          where("userId", "==", user.uid),
          where("isCompleted", "==", filter)
        );
        const querySnapshot = await getDocs(judgementsQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJudgements(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="w-[500px] flex flex-col items-center">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          onClick={() => setFilter(true)}
          className={`px-6 py-2 text-sm font-urbanist transition duration-300 rounded-lg ${filter === true ? "bg-PRIMARY text-white shadow-md scale-105" : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
        >
          Completed
        </Button>

        <Button
          onClick={() => setFilter(false)}
          className={`px-6 py-2 text-sm font-urbanist transition duration-300 rounded-lg ${filter === false ? "bg-PRIMARY text-white shadow-md scale-105" : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
        >
          Not Completed
        </Button>
      </div>
      <ScrollArea className="h-[350px] w-[550px] rounded-md border bg-white p-4">
        <div className="flex flex-col items-center text-gray-500">
          {judgements.length === 0 ? (
            <div className="flex flex-col items-center">
              <img
                src="/images/man-thinking.svg"
                alt="No Judgements"
                className="w-[250px] object-contain mt-8"
              />
              <p className="text-sm font-urbanist font-medium text-PRIMARY">
                No past decisions
              </p>
            </div>
          ) : (
            <div className="flex flex-col w-full space-y-4">
              {judgements.map((judgement) => (
                <div
                  key={judgement.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                >
                  <div
                    onClick={() => openDecision(judgement.id, judgement.isCompleted)}
                    className="flex flex-col w-full cursor-pointer"
                  >
                    <div className="font-bold text-base text-black break-words">
                      {judgement.title}
                    </div>
                    <div className="font-light text-sm text-gray-700 break-words whitespace-normal mt-1">
                      {judgement.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {judgement.createdAt?.toDate()?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(judgement.id);
                    }}
                    className="ml-4 p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition-all duration-300 shadow-sm"
                  >
                    <IoTrashBin className="text-orange-500 text-lg" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <ScrollBar className="bg-SECONDARY" />
      </ScrollArea>
    </div>

  );
}

export default JudgementList;