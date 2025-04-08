"use client"
import { deleteUser } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const DeleteModal = ({ userId, onClose }) => {
    const router  = useRouter();

      const deleteAccount = async () => {
        try {
          await updateDoc(doc(db, "users", userId), { deleted: true });
          await deleteUser(auth.currentUser);
          router.push("/");
        } catch (error) {
          console.error(error)
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