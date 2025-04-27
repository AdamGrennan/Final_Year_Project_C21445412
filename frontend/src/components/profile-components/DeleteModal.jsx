"use client"
import { deleteUser } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { collection, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const DeleteModal = ({ userId, onClose }) => {
  const router = useRouter();

  const deleteAccount = async () => {
    try {
      const decisionsQuery = query(collection(db, "judgement"), where("userId", "==", userId));
      const dashboardQuery = query(collection(db, "dashboard"), where("userId", "==", userId));
      const chatQuery = query(collection(db, "chat"), where("userId", "==", userId));
      const levelQuery = query(collection(db, "level_noise"), where("userId", "==", userId));
      const trendQuery = query(collection(db, "trends"), where("userId", "==", userId));
      const decisionSnapshots = await getDocs(decisionsQuery);
      const chatSnapshots = await getDocs(chatQuery);
      const dashboardSnapshots = await getDocs(dashboardQuery);
      const levelSnapshots = await getDocs(levelQuery);
      const trendSnapshots = await getDocs(trendQuery);
  
      const deleteDecisionPromises = decisionSnapshots.docs.map((docSnap) =>
        deleteDoc(doc(db, "judgement", docSnap.id))
      );
  
      const deleteDashboardPromises = dashboardSnapshots.docs.map((docSnap) =>
        deleteDoc(doc(db, "dashboard", docSnap.id))
      );

      const deleteChatPromises = chatSnapshots.docs.map((docSnap) =>
        deleteDoc(doc(db, "chat", docSnap.id))
      );

      const levelPromises = levelSnapshots.docs.map((docSnap) =>
        deleteDoc(doc(db, "level_noise", docSnap.id))
      );

      const trendPromises = trendSnapshots.docs.map((docSnap) =>
        deleteDoc(doc(db, "trends", docSnap.id))
      );

      const deleteUserDoc = deleteDoc(doc(db, "users", userId));
  
      await Promise.all([...trendPromises ,...levelPromises ,...deleteChatPromises, ...deleteDecisionPromises, 
        ...deleteDashboardPromises, deleteUserDoc]);
  
      await deleteUser(auth.currentUser);
  
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-2xl text-center font-urbanist font-semibold text-gray-900">Are you sure you want to delete account?</h3>
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            className="px-4 py-2 text-white rounded-md bg-PRIMARY hover:bg-opacity-80"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;