import React from 'react';

export const PromptSelector = ({ prompts = [], onSelect }) => {
  if (prompts.length === 0) return null; 

  return (
    <div className="text-center bg-white p-4 rounded shadow-md mt-4 font-urbanist">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">How would you like to proceed?</h3>
      <div className="flex flex-col gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt)}
            className="bg-PRIMARY text-white px-4 py-2 rounded hover:bg-orange-500 transition"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
