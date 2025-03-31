import { db } from "@/config/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";

export const getFeedback = async (userId) => {
  try {

    const feedbackRef = collection(db, "feedback");
    const q = query(feedbackRef, where("userId", "==", userId));
    const feedbackDocs = await getDocs(q);

    let helpfulCount = 0, unhelpfulCount = 0, totalCount = 0, changedPerspective = 0;
    
    feedbackDocs.forEach(doc => {
        const data = doc.data();
        if (data.helpful === "Yes") helpfulCount++;
        if (data.helpful === "No") unhelpfulCount++;
        if (data.perspectiveChanged === "Yes") changedPerspective++;
        totalCount++;
    });

    return {
        helpfulRate: totalCount ? (helpfulCount / totalCount) * 100 : 0,
        unhelpfulRate: totalCount ? (unhelpfulCount / totalCount) * 100 : 0,
        perspectiveChangeRate: totalCount ? (changedPerspective / totalCount) * 100 : 0
    }

  } catch (error) {
    console.error("Error fetching feedback:", error);
  }
};
