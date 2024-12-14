"use client";
import { useRouter } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area"
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from './ui/button';
import { FaPlus } from "react-icons/fa";

const JudgementList = ( { templates, addTemplate }) => {
    const router = useRouter();
    const [judgements, setJudgements] = useState([]);
    const { user } = useUser();

    const openChat = (judgementId) => {
      router.push(`/Chat_Page/${judgementId}`);
    }
    
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


      const filterTemplates = ({ template }) => {

      } 

return(
  <div className="w-[500px]">
     <div className="flex flex-wrap gap-2 mb-4">
     <Button
          className="p-1 bg-white text-black rounded-md font-urbanist border"
                >
                 <div>
                 <div className="font-light">All</div>
                 </div>
                </Button>
    {templates.length > 0 ? (
            templates.map((template) => (
                <Button 
                    onClick={() => filterTemplates(template)} 
                    key={template}
                    className="p-1 bg-white text-black rounded-md font-urbanist border"
                >
                 <div>
                 <div className="font-light">{template.name}</div>
                 </div>
                </Button>
            ))
        ) : (
            <p className="text-gray-500">No templates found for this user.</p>
        )}
          <Button onClick={addTemplate} className="w-10 h-10 p-1 bg-PRIMARY text-white rounded-full font-urbanist border">
          <FaPlus className="text-white"/>
        </Button>
    </div>

    <ScrollArea className="h-[400px] w-[500px] rounded-md border p-4 bg-GRAAY">
      {judgements.length > 0 ? (
            judgements.map((judgement) => (
                <Button 
                    onClick={() => openChat(judgement.id)} 
                    key={judgement.id}
                    className="mb-2 w-full text-left p-2 bg-white text-black rounded-md font-urbanist"
                >
                 <div>
                 <div className="font-medium">{judgement.title}</div>
                 <div className="font-light">{judgement.description}</div>
                 </div>
                </Button>
            ))
        ) : (
            <p className="text-gray-500">No judgments found for this user.</p>
        )}
   </ScrollArea>
   </div>

   
);
}

export default JudgementList;