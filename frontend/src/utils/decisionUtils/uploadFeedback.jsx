import { db } from "@/config/firebase";
import { doc, addDoc, serverTimestamp, collection } from "firebase/firestore";

export const uploadFeedback = async (user, decisionId, feedback) => {
  try {
    const feedbackData = {
      userId: user.uid,
      decisionId,
      ...feedback,
      usedInNextChat: false,
      createdAt: serverTimestamp(),
    };

    const feedbackRef = collection(db, "feedback");
    await addDoc(feedbackRef, feedbackData);

  } catch (error) {
    console.error("Error saving feedback:", error);
  }
};
