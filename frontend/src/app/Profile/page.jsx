"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { auth, db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { MdModeEdit } from "react-icons/md";
import EditModal from "@/components/profile-components/EditModal";
import DeleteModal from "@/components/profile-components/DeleteModal";

export default function ProfilePage() {
  const { user } = useUser();
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [value, setValue] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditClick = (field) => {
    setFieldToEdit(field);
    setValue(field === "name" ? user?.name : ""); 
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      if (fieldToEdit === "name") {
        await updateDoc(doc(db, "users", user.uid), { name: value });
        alert("Name updated successfully.");
      } else if (fieldToEdit === "password") {
        await updatePassword(auth.currentUser, value);
        alert("Password updated successfully.");
      }
      setShowEditModal(false);
    } catch (error) {
    alert("Failed to update. Please try again.");
    console.log("PROFILE", error);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  }

  return (
    <div className="flex justify-start p-4">
    <div className="w-1/2 mx-auto p-4 bg-white rounded-lg shadow-md p-6">
      <Label className="font-urbanist text-PRIMARY text-2xl font-bold mb-2">Profile</Label>

      <div className="mb-4">
        <Label className="font-urbanist font-semibold">Email:</Label>
        <div className="flex items-center">
          <div className="font-urbanist text-gray-800 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm w-full">
            {user?.email || "No Email"}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <Label className="font-urbanist font-semibold">Name:</Label>
        <div className="flex items-center">
          <div className="font-urbanist text-gray-800 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm w-full">
            {user?.name || "No Name"}
          </div>
          <Button onClick={() => handleEditClick("name")} className="p-2 text-white rounded-md bg-white">
            <MdModeEdit className="text-PRIMARY transform transition-transform duration-300 group-active:scale-[1.7]"/>
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Label className="font-urbanist font-semibold">Password:</Label>
        <div className="flex items-center">
          <div className="font-urbanist text-gray-800 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm w-full">
            ••••••••
          </div>
          <Button onClick={() => handleEditClick("password")} className="p-2 text-white rounded-md bg-white">
            <MdModeEdit className="text-PRIMARY transform transition-transform duration-300 group-active:scale-[1.7]"/>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleDelete}
          className="px-4 py-2 bg-PRIMARY font-urbanist text-white rounded hover:bg-opacity-80"
        >
          Delete Account
        </Button>
      </div>

      {showEditModal && (
        <EditModal
          field={fieldToEdit}
          value={value}
          setValue={setValue}
          onSave={handleSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
    </div>
  );
}

