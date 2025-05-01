import { collection, doc, addDoc, getDocs, getDoc, query, where, writeBatch, orderBy, serverTimestamp, arrayUnion } from "firebase/firestore";
import { db } from "@/config/firebase";

export const saveChats = async (user, judgementId, newMessages, detectedBias = [], detectedNoise =[]) => {
  if (!user?.uid || !judgementId) {
    console.error("Invalid user or judgementId.");
    return;
  }

  try {
    const chatCollection = collection(db, "chat");

    for (const msg of newMessages) {
      await addDoc(chatCollection, {
        judgementId, 
        userId: user.uid,
        text: msg.text,
        sender: msg.sender || user.name, 
        detectedBias : detectedBias,
        detectedNoise : detectedNoise,
        createdAt: serverTimestamp(), 
      });
    }
  } catch (error) {
    console.error("Failed to save chat:", error);
  }
};

export const fetchChats = async (user, judgementId) => {
  if (!user?.uid || !judgementId) {
    console.error("Invalid user or judgementId.");
    return [];
  }

  try {
    const chatQuery = query(
      collection(db, "chat"),
      where("judgementId", "==", judgementId),
      orderBy("createdAt", "asc")
    );

    const chatSnapshot = await getDocs(chatQuery);

    const messages = chatSnapshot.docs.map((doc) => {
      const chatData = doc.data();
      return {
        id: doc.id,
        text: chatData.text || "",
        sender: chatData.sender || "Unknown",
        createdAt: chatData.createdAt ? chatData.createdAt.toDate() : new Date(),
      };
    });

    console.log("Fetched Messages:", messages); 
    return messages;

  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

export const fetchDecisionDetails = async (judgmentId) => {
  if (!judgmentId || judgmentId === "judgement") {
    console.error("fetchDecisionDetails called with invalid ID:", judgmentId);
  }

  const docRef = doc(db, "judgement", judgmentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.warn("No decision found for ID:", judgmentId);
    return null;
  }
};