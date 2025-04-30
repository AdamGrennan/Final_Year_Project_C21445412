"use client";

import React, { useState } from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { MdModeEdit } from "react-icons/md";
import EditModal from "@/components/profile-components/EditModal";
import DeleteModal from "@/components/profile-components/DeleteModal";
import { updatePassword } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { useUser } from "@/context/UserContext";
import { FaUser } from "react-icons/fa";
import { db, auth } from "@/config/firebase";

export default function ProfilePage() {
  const { user } = useUser();
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [value, setValue] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { updateUser } = useUser();

  const handleEditClick = (field) => {
    setFieldToEdit(field);
    setValue(field === "name" ? user?.name : "");
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      if (fieldToEdit === "name") {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { name: value });
        updateUser({ name: value });

      } else if (fieldToEdit === "password") {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

        if (!regex.test(value)) {
          alert("Password must be 8-15 characters long, include uppercase, lowercase, a number, and a special character.");
          return;
        }
        
        await updatePassword(auth.currentUser, value);
        alert("Password updated successfully.");
      }
      setShowEditModal(false);
    } catch (error) {
      console.error("PROFILE", error);
    }
  };


  const handleDelete = () => {
    setShowDeleteModal(true);
  }

  return (
    <div className="flex justify-start p-12">
      <div className="w-2/3 mx-auto p-4 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2">
          <FaUser className="text-PRIMARY" />
          <Label className="font-urbanist text-PRIMARY text-2xl font-bold">Profile</Label>
        </div>
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
          <div className="flex items-center space-x-2">
            <div className="font-urbanist text-gray-800 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm w-full ">
              {user?.name || "No Name"}
            </div>
            <Button onClick={() => handleEditClick("name")} className="p-2 text-white rounded-md bg-white">
              <MdModeEdit className="text-PRIMARY transform transition-transform duration-300 group-active:scale-[1.7]" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Label className="font-urbanist font-semibold">Password:</Label>
          <div className="flex items-center space-x-2">
            <div className="font-urbanist text-gray-800 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm w-full">
              ••••••••
            </div>
            <Button onClick={() => handleEditClick("password")} className="p-2 text-white rounded-md bg-white">
              <MdModeEdit className="text-PRIMARY transform transition-transform duration-300 group-active:scale-[1.7]" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleDelete}
            disabled={!user}
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
        {user && showDeleteModal && (
          <DeleteModal
            userId={user.uid}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
}

