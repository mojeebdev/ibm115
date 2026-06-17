"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { slugifyFilename } from "@/lib/utils";

interface TypewriterCardProps {
  text: string;
  personalMemory?: string;
  isGenerating?: boolean;
  year?: number;
  name?: string;
  onComplete?: () => void;
}

const KEY_COUNT = 12;

function TypewriterKey({ index, active }: { index: number; active: boolean }) {
  const offsetY = index % 2 === 0 ? 0 : 3;
  return (
    <g
      className={`typewriter-key${active ? " active" : ""}`}
      transform={`translate(${index * 34 + 8}, ${offsetY})`}
    >
      <ellipse
        cx="14"
        cy="22"
        rx="13"
        ry="6"
        fill="var(--selectric-key-shadow)"
      />
      <ellipse cx="14" cy="16" rx="13" ry="10" fill="var(--selectric-key)" />
      <ellipse
        className="key-highlight"
        cx="14"
        cy="12"
        rx="8"
        ry="4"
        fill="var(--selectric-accent)"
        opacity="0.75"
      />
    </g>
  );
}

export default function TypewriterCard({
  text,
  personalMemory,
  isGenerating = false,
  year,
  name,
  onComplete,
}: TypewriterCardProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const cardRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  const userStory = personalMemory?.trim() ?? "";

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      setIsComplete(false);
      setIsTyping(false);
      completedRef.current = false;
      return;
    }

    setDisplayedText("");
    setIsComplete(false);
    setIsTyping(true);
    completedRef.current = false;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));

        const keys = new Set<number>();
        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          keys.add(Math.floor(Math.random() * KEY_COUNT));
        }
        setActiveKeys(keys);
        setTimeout(() => setActiveKeys(new Set()), 80);

        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setIsComplete(true);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }
    }, 35);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  const handleSavePng = useCallback(async () => {
    if (!cardRef.current || !isComplete) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#0f0f0f",
      scale: 2,
      ignoreElements: (el) => el.classList.contains("typewriter-save-btn"),
    });
    const link = document.createElement("a");
    link.download = `ibm-memory-${year || "unknown"}-${slugifyFilename(name || "memory")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [isComplete, year, name]);

  return (
    <div className="typewriter-card" ref={cardRef}>
      {/* Paper feeds into the Selectric paper slot */}
      <div className="typewriter-paper">
        <div className="typewriter-paper-header">
          <span>ibm.1911</span>
          <span>115 years</span>
        </div>

        {userStory && (
          <div className="typewriter-paper-user">
            <p className="typewriter-paper-label">Your memory</p>
            <p className="typewriter-paper-user-text">{userStory}</p>
          </div>
        )}

        {(userStory || displayedText || isGenerating) && (
          <div className="typewriter-paper-ai">
            {userStory && (
              <p className="typewriter-paper-label">IBM remembers</p>
            )}
            <div className="typewriter-paper-text">
              {displayedText}
              {(isTyping || isGenerating) && (
                <span className="cursor-blink">_</span>
              )}
            </div>
          </div>
        )}

        {isComplete && (
          <button
            type="button"
            className="btn-primary typewriter-save-btn"
            onClick={handleSavePng}
          >
            Save as PNG
          </button>
        )}
      </div>

      {/* Single Selectric base — full machine, paper loaded */}
      <div className="typewriter-machine">
        <Image
          src="/images/selectric-reference-desktop.jpg"
          alt=""
          width={480}
          height={360}
          sizes="(max-width: 768px) 100vw, 480px"
          className="typewriter-selectric-desktop typewriter-machine-photo"
          aria-hidden
          priority
        />
        <Image
          src="/images/selectric-reference-mobile.jpg"
          alt=""
          width={480}
          height={360}
          sizes="100vw"
          className="typewriter-selectric-mobile typewriter-machine-photo"
          aria-hidden
          priority
        />
        <div className="typewriter-keys-overlay" aria-hidden="true">
          <svg viewBox="0 0 420 48" width="100%" height="48">
            {Array.from({ length: KEY_COUNT }, (_, i) => (
              <TypewriterKey key={i} index={i} active={activeKeys.has(i)} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}