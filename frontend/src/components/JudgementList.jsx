"use client";
import { useRouter } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area"
import { doc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from './ui/button';
import { IoTrashBin } from "react-icons/io5";

const JudgementList = () => {
  const router = useRouter();
  const [judgements, setJudgements] = useState([]);
  const { user } = useUser();

  const openChat = (judgementId) => {
    router.push(`/Chat_Page/${judgementId}`);
  }

  const handleDelete = async (judgementId) => {
    try {
      const judgeRef = doc(db, "judgement", judgementId);
      await deleteDoc(judgeRef);
      console.log("Judgement deleted successfully.")
      fetchJudgements();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchJudgements();
  }, [user]);

  const fetchJudgements = async () => {
    if (user && user.uid) {
      try {
        const judgementsQuery = query(
          collection(db, "judgement"),
          where("userId", "==", user.uid)
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
      <div className="flex flex-wrap gap-4 mb-4">
        <p>Hi</p>
      </div>

      <ScrollArea className="h-[400px] w-[500px] rounded-md border p-4 bg-gray-100">
        <div className="flex flex-col gap-y-4">
          {judgements.map((judgement) => (
            <div key={judgement.id} className="flex items-center gap-4">
              <Button
                onClick={() => openChat(judgement.id)}
                className="w-full text-left p-4 bg-white text-black rounded-md font-urbanist h-auto"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <div className="font-bold text-sm">{judgement.title}</div>
                    <div className="font-light text-sm">{judgement.description}</div>
                    {judgement.createdAt?.toDate()?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) || "No Date"}
                  </div>
                  <div className="font-light">{judgement.template}</div>
                </div>
              </Button>
              <Button
                onClick={() => handleDelete(judgement.id)}
                className="flex items-center justify-center p-2 bg-transparent"
              >
                <IoTrashBin className="text-PRIMARY" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>


  );
}

export default JudgementList;