import { ScrollArea } from "@/components/ui/scroll-area"
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

const JudgementList = () => {
    const [judgements, setJudgements] = useState([]);
    const { user } = useUser();
    

    useEffect(() => {
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
        fetchJudgements();
      }, [user]);

return(
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 bg-GRAAY">
      {judgements.length > 0 ? (
            judgements.map((judgement) => (
                <button
                    key={judgement.id}
                    className="mb-2 w-full text-left p-2 bg-blue-500 text-white rounded-md"
                >
                    {judgement.title}
                </button>
            ))
        ) : (
            <p className="text-gray-500">No judgments found for this user.</p>
        )}
   </ScrollArea>
);
}


export default JudgementList;