"use client";
import { useRouter } from 'next/navigation';
import JudgementButton from '@/components/JudgementButton';
import DashboardButton from '@/components/DashboardButton';
import { Label } from "@/components/ui/label"
import JudgementList from "@/components/JudgementList";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth"; 
import { Button } from '@/components/ui/button';
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState(""); 
  const [templates, setTemplates] = useState([]);

  const [userId, setUserId] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid); 
        } else {
          setUserId(null);
        }
      });
  
      return () => unsubscribe();
    }, []);

  const handleNewTemplate = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
    if (userId) { 
      try {
        const templatesQuery = query(
          collection(db, "template"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(templatesQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTemplates(data);
        console.log("Fetched templates:", data);
      } catch (error) {
        console.log(error);
      }
    }
    };
    fetchTemplates();
  }, [userId]);

  const addTemplate = async () => {
    if (!newTemplate.trim()) {
      alert("Template name cannot be empty.");
      return;
    }

    if (templates.length >= 6) {
      alert("You can only create up to 5 templates.");
      return;
    }

     try {
            const templateRef = await addDoc(collection(db, "template"), {
            name: newTemplate,
            userId: userId
          });
          setTemplates((prevTemplates) => [
            ...prevTemplates,
            { id: templateRef.id, name: newTemplate, userId },
          ]);
          alert("Template saved successfully!");
          
        } catch (error) {
          console.error("Error saving template:", error);
          alert("Failed to save template.");
        }
    
    setTemplates((prevTemplates) => [...prevTemplates, newTemplate]); 
    setNewTemplate("");
    setShowModal(false);
      };

  const newJudgement = () => {
    router.push('/Judgement_Form');
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex gap-4">
        <div className="flex flex-col w-full md:w-1/2">
          <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold mb-2 ">Recent Activity</Label>
            <JudgementList templates={templates} addTemplate={handleNewTemplate}/>
        </div>

        <div className="flex items-end flex-col w-full md:w-1/2">
          <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold mb-2 ">Tools</Label>
          <div className="flex flex-col space-y-[50px]">
        <JudgementButton onClick={newJudgement} />
        <DashboardButton />
    </div>
        </div>
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      {showModal && (
        <Modal
          value={newTemplate}
          setValue={setNewTemplate}
          onSave={addTemplate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

const Modal = ({value, setValue, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-bold text-gray-900">New Template</h3>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter template name`}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-4"
        />
        <div className="flex justify-end gap-4 mt-4">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="px-4 py-2 bg-PRIMARY text-white rounded-md font-urbanist"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
