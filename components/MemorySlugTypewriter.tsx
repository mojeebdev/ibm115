"use client";

import TypewriterCard from "@/components/TypewriterCard";
import type { Memory } from "@/lib/firestore";

interface MemorySlugTypewriterProps {
  memory: Pick<
    Memory,
    "name" | "year" | "personalMemory" | "aiResponse"
  >;
}

export default function MemorySlugTypewriter({
  memory,
}: MemorySlugTypewriterProps) {
  return (
    <div className="memory-slug-typewriter">
      <TypewriterCard
        text={memory.aiResponse}
        personalMemory={memory.personalMemory}
        year={memory.year}
        name={memory.name}
        instant
      />
    </div>
  );
}