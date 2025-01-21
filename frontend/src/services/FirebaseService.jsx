import { collection, doc, getDocs, query, where, writeBatch, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

export const saveChats = async (user, judgementId, newMessages, detectBias) => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    if (!judgementId) {
      console.error("Judgement ID is missing");
      return;
    }

    try {
      const batch = writeBatch(db);
      console.log("Starting batch operation...");

      newMessages.forEach((msg, index) => {
        console.log(`Processing message #${index}:`, msg);
        const chatRef = doc(collection(db, "chat"));
        batch.set(chatRef, {
          judgementId,
          messages: msg,
          createdAt: serverTimestamp(),
          userId: user.uid,
        });
      });

      const judgeRef = doc(db, "judgement", judgementId);
      batch.update(judgeRef, { hasMessages: true });

      const detectedBiases = detectBias();
      if (detectedBiases && detectedBiases.length > 0) {
        const judgeRef = doc(db, "judgment", judgementId);
        batch.update(judgeRef, {
          biases: Array.from(new Set(detectedBiases)),
          updatedAt: serverTimestamp(),
        });
      }

      console.log("Committing batch...");
      await batch.commit();
      console.log("Batch commit successful");
    } catch (error) {
      console.error("Error saving chat:", error);
      alert("Failed to save chat.");
    }
  };

export const fetchChats = async (user, judgementId) => {
    if (!user?.uid || !judgementId) {
        console.error("Invalid user or judgementId.");
        return []; 
      }
          try {
            const chatsQuery = query(
              collection(db, "chat"),
              where("judgementId", "==", judgementId),
              orderBy("createdAt", "asc")
            );
            const querySnapshot = await getDocs(chatsQuery);
  
            return querySnapshot.docs.map(doc => doc.data().messages || []).flat();
          } catch (error) {
            console.log(error);
          }
      };
