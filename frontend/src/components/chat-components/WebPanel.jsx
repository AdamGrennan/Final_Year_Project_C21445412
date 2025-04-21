import React from "react";

const fallbackLinks = [
  {
    title: "How to Improve Your Decision-Making Skills",
    url: "https://www.psychologytoday.com/us/articles/decision-making-tips",
    source: "psychologytoday.com"
  },
  {
    title: "Understanding Cognitive Biases",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9274645/",
    source: "ncbi.nlm.nih.gov"
  },
  {
    title: "Level Noise vs. Bias: What's the Difference?",
    url: "https://behavioralscientist.org/noise-book-summary/",
    source: "behavioralscientist.org"
  },
  {
    title: "How Confirmation Bias Influences Decisions",
    url: "https://thedecisionlab.com/biases/confirmation-bias",
    source: "thedecisionlab.com"
  },
  {
    title: "Daniel Kahneman on Noise and Human Judgment",
    url: "https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/lecture/",
    source: "nobelprize.org"
  }
];

export const WebPanel = ({ links = [] }) => {
  const displayLinks = links.length > 0 ? links.slice(0, 5) : fallbackLinks;

  return (
    <div className="text-center font-urbanist h-64 border-l p-4 shadow-sm overflow-y-auto bg-yellow-50 border border-yellow-300 rounded text-yellow-900 text-sm">
      <h2 className="text-sm font-semibold mb-3">Related Resources</h2>

      <ul className="space-y-3 text-sm text-left">
        {displayLinks.map((link, index) => (
          <li key={index}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {link.title || "Untitled"}
            </a>
            {link.source && (
              <div className="text-xs text-gray-600 italic mt-1">{link.source}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
