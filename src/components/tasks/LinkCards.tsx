import React from "react";
import { getLinkPreview, LinkPreview } from "@/utils/linkPreview";

interface Props {
  links: string[];
}

const LinkCards: React.FC<Props> = ({ links }) => {
  const previews: LinkPreview[] = links.map((link) => getLinkPreview(link));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {previews.map((preview, index) => (
        <div
          key={index}
          className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 shadow hover:shadow-lg transition duration-300"
        >
          <div className="flex items-center space-x-2 text-sm text-zinc-400 mb-1">
            <img
              src={preview.favicon}
              alt="favicon"
              className="w-4 h-4 rounded"
            />
            <span>{preview.domain}</span>
          </div>
          <a
            href={preview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold hover:underline break-words"
          >
            {preview.title}
          </a>
        </div>
      ))}
    </div>
  );
};

export default LinkCards;
