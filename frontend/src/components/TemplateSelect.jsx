import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const TemplateSelect = ({ onSelect }) => {
  const [userId, setUserId] = useState(null);
  const [templates, setTemplates] = useState([]);

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
          console.error("Error fetching templates:", error);
        }
      }
    };

    fetchTemplates();
  }, [userId]);

  return (
    <div className="w-[300px]">
      <Select onValueChange={(value) => onSelect(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="none" value="none">
            None
          </SelectItem>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.name}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelect;
