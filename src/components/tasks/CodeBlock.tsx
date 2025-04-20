"use client"
import { useRef, useEffect } from "react";

// Stores scrollLeft per block key
const scrollMap = new Map<string, number>();

const CodeBlock = ({
  children,
  className,
  blockKey,
}: {
  children: React.ReactNode;
  className?: string;
  blockKey: string; // 👈 unique key for each block
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  // Restore scroll position
  useEffect(() => {
    const pre = preRef.current;
    const saved = scrollMap.get(blockKey) ?? 0;
    if (pre) {
      pre.scrollLeft = saved;
    }
  }, [blockKey]);

  // Save scroll on scroll
  const handleScroll = () => {
    if (preRef.current) {
      scrollMap.set(blockKey, preRef.current.scrollLeft);
    }
  };

  return (
    <pre
      ref={preRef}
      onScroll={handleScroll}
      className="bg-black text-gray-100 p-4 rounded-md mb-4 overflow-x-auto text-sm font-mono"
    >
      <code className={className}>{children}</code>
    </pre>
  );
};

export default CodeBlock;
