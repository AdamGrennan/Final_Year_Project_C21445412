"use client";
import { useRouter } from 'next/navigation';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { doc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from '../ui/button';
import { IoTrashBin } from "react-icons/io5";

const JudgementList = () => {
  const router = useRouter();
  const [judgements, setJudgements] = useState([]);
  const { user } = useUser();
  const [filter, setFilter] = useState(true);

  const openDecision = (judgementId, isCompleted) => {
    if (isCompleted) {
      router.push(`/final-report/${judgementId}?revisited=true`);
    } else {
      router.push(`/chat-page/${judgementId}`);
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
      <ScrollArea className="h-[380px] w-[550px] rounded-md border bg-white p-4">
        <div className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-center">
          <div className="flex bg-gray-100 rounded-full p-1 shadow-inner">
            <Button
              onClick={() => setFilter(true)}
              className={`w-28 h-8 text-xs font-medium rounded-full transition-all duration-300
        ${filter ? "bg-PRIMARY text-white shadow-md scale-105" : "text-gray-700 hover:bg-gray-100"}`}>
              Completed
            </Button>
            <Button
              onClick={() => setFilter(false)}
              className={`w-28 h-8 text-xs font-medium rounded-full transition-all duration-300
        ${!filter ? "bg-PRIMARY text-white shadow-md scale-105" : "text-gray-700 hover:bg-gray-100"}`}>
              Not Completed
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          {judgements.length === 0 ? (
            <div className="flex flex-col items-center">
              <img
                src="/images/man-thinking.svg"
                alt="No Judgements"
                className="w-[250px] object-contain mt-8"
              />
              <p className="text-sm font-urbanist font-medium text-PRIMARY italic">
                No past decisions
              </p>
            </div>
          ) : (
            <div className="flex flex-col w-full space-y-4">
              {judgements.map((judgement) => (
                <div
                  key={judgement.id}
                  className="border border-gray-300 flex items-center justify-between bg-white p-4 rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  <div
                    onClick={() => openDecision(judgement.id, judgement.isCompleted)}
                    className="flex flex-col w-full cursor-pointer"
                  >
                    <div className="font-bold text-base text-black break-words">
                      {judgement.title}
                    </div>
                    <div className="font-light text-sm text-gray-700 break-words whitespace-normal mt-1">
                      {judgement.situation}
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
        <ScrollBar className="bg-gray-100" />
      </ScrollArea>
    </div>

  );
}

export default JudgementList;