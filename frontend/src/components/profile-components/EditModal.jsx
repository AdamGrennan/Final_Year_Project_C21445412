"use client"
import { Button } from "../ui/button";

const EditModal = ({ field, value, setValue, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-bold text-gray-900">Edit {field}</h3>
        <input
          type={field === "password" ? "password" : "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter new ${field}`}
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
export default EditModal;
