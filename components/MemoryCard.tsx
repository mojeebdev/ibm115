"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { likeMemory, type Memory } from "@/lib/firestore";
import ShareButton from "./ShareButton";

const FALLBACK_SRC = "/images/selectric-reference-thumbnail.jpg";

interface MemoryCardProps {
  memory: Memory;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const [likes, setLikes] = useState(memory.likes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const likedIds: string[] = JSON.parse(
      localStorage.getItem("liked-memories") || "[]"
    );
    setLiked(likedIds.includes(memory.id));
  }, [memory.id]);

  useEffect(() => {
    if (!memory.photoUrl) {
      console.log(
        "[MemoryCard] no-photo fallback src:",
        `${window.location.origin}${FALLBACK_SRC}`
      );
    }
  }, [memory.photoUrl]);

  const handleLike = async () => {
    const likedIds: string[] = JSON.parse(
      localStorage.getItem("liked-memories") || "[]"
    );
    if (likedIds.includes(memory.id)) return;

    setLiked(true);
    setLikes((l) => l + 1);
    likedIds.push(memory.id);
    localStorage.setItem("liked-memories", JSON.stringify(likedIds));

    try {
      await likeMemory(memory.id);
    } catch {
      setLiked(false);
      setLikes(memory.likes);
    }
  };

  const excerpt =
    memory.aiResponse.length > 100
      ? memory.aiResponse.substring(0, 100) + "…"
      : memory.aiResponse;

  return (
    <article className="memory-card">
      <div className="memory-card-photo">
        {memory.photoUrl ? (
          <Image
            src={memory.photoUrl}
            alt={`${memory.name}'s IBM memory`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="memory-card-fallback-wrap">
            <Image
              src={FALLBACK_SRC}
              alt=""
              width={400}
              height={200}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                filter: "sepia(0.4) brightness(0.6)",
              }}
              onError={() => {
                console.error(
                  "[MemoryCard] fallback image failed to load:",
                  FALLBACK_SRC
                );
              }}
            />
            <span className="memory-card-fallback-year">{memory.year}</span>
          </div>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        <p className="memory-card-meta">
          {memory.name} · {memory.year}
        </p>

        <h3 className="memory-card-product">{memory.product}</h3>

        <hr className="memory-card-rule" />

        <p className="memory-card-excerpt">{excerpt}</p>

        <hr className="memory-card-rule" />

        <div className="memory-card-actions">
          <button
            type="button"
            onClick={handleLike}
            className="memory-card-like"
            style={{ color: liked ? "var(--ibm-blue)" : "var(--ink-secondary)" }}
          >
            <span style={{ color: liked ? "var(--ibm-blue)" : "inherit" }}>
              {liked ? "♥" : "♡"}
            </span>{" "}
            {likes}
          </button>
          <ShareButton memory={memory} />
          <Link href={`/m/${memory.slug}`} className="memory-card-view">
            View →
          </Link>
        </div>
      </div>
    </article>
  );
}