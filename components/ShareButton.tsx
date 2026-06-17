"use client";

import { generateXShareText, MemoryShare } from "@/lib/utils";

interface ShareButtonProps {
  memory: MemoryShare;
  className?: string;
  style?: React.CSSProperties;
}

export default function ShareButton({
  memory,
  className,
  style,
}: ShareButtonProps) {
  const handleShare = () => {
    const text = generateXShareText(memory);
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(xUrl, "_blank", "width=550,height=420");
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--ink-secondary)",
        background: "none",
        border: "none",
        cursor: "pointer",
        transition: "color 0.2s ease",
        ...style,
      }}
    >
      Share
    </button>
  );
}