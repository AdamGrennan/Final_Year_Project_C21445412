"use client";
import { useRouter } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const [filter, setFilter] = useState(false);
  const { detectedBias, detectedNoise } = useDecision();

  const openDecision = (judgementId, isCompleted) => {
    if (isCompleted === true) {
      router.push(`/Final_Report/${judgementId}`);
    } else {
      router.push(`/Chat_Page/${judgementId}`);
    }
  };

  const handleDelete = (judgementId) => {
    try {
      setTimeout(async () => {
        const judgeRef = doc(db, "judgement", judgementId);
        await deleteDoc(judgeRef);
        console.log("Judgement deleted successfully.");
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
    console.log("Bias Context", detectedBias);
    console.log("Noise Context", detectedNoise);
    if (user && user.uid) {
      try {
        console.log("Fetching judgements with filter:", filter, "for userId:", user.uid);
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
        console.log("Fetched judgments:", data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="w-[500px]">
      <div className="flex items-center justify-start mb-4">
        <Button
          onClick={() => setFilter(true)}
          className={`px-4 py-2 mr-2 font-urbanist transform transition-transform duration-300 active:scale-[1.1] ${filter === true ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"}`}
        >
          Completed
        </Button>
        <Button
          onClick={() => setFilter(false)}
          className={`px-4 py-2 font-urbanist ${filter === false ? "bg-PRIMARY text-white" : "bg-gray-200 text-black"}`}
        >
          Not Completed
        </Button>
      </div>
      <ScrollArea className="h-[325px] w-[550px] rounded-md border bg-GRAAY">
        <div className="flex flex-col items-center text-gray-500">
          {judgements.length === 0 ? (
            <div className="flex flex-col items-center">
              <img
                src="/images/man-thinking.svg"
                alt="No Judgements"
                className="w-[250px] object-contain mt-8"
              />
              <p className="text-sm font-urbanist font-medium text-PRIMARY">
                No past decisions</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {judgements.map((judgement) => (
                <div
                  key={judgement.id}
                  className="flex items-center justify-start mt-4"
                >
                  <Button
                    onClick={() => openDecision(judgement.id, judgement.isCompleted)}
                    className="w-[450px] text-left bg-white text-black rounded-md font-urbanist h-auto "
                  >
                    <div className="flex flex-col w-full">
                      <div className="font-bold text-sm break-words">
                        {judgement.title}
                      </div>
                      <div className="font-light text-sm break-words whitespace-normal">
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
                      className="flex items-center justify-center rounded-lg shadow-sm transform transition-transform duration-300 active:scale-[1.7]"
                    >
                      <IoTrashBin className="text-PRIMARY transform transition-transform duration-300 group-active:scale-[1.7]" />
                    </Button>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

    </div>


  );
}

export default JudgementList;