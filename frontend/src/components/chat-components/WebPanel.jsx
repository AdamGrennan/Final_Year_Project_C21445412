import React from "react";

export const WebPanel = ({ links = [] }) => {
  return (
    <div className="text-center font-urbanist h-64 border-l p-4 shadow-sm overflow-y-auto bg-yellow-50 border border-yellow-300 rounded text-yellow-900 text-sm">
      <h2 className="text-sm font-semibold mb-3">Related Resources</h2>

      {links.length === 0 ? (
        <p className="text-gray-500 text-sm">No related links yet. They’ll appear here as your chat progresses.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {links.slice(0, 5).map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {link.title || "Untitled"}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
