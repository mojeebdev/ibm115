"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import MemoryCard from "@/components/MemoryCard";

import {
  getMemories,
  getMemoryCount,
  type Memory,
  type SortOption,
} from "@/lib/firestore";
import { getDecade } from "@/lib/utils";

const DECADES = [
  "All",
  "1910s–1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s+",
] as const;

export default function CelebrationPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [decade, setDecade] = useState<string>("All");
  const [sort, setSort] = useState<SortOption>("newest");
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMemories = useCallback(
    async (reset = false) => {
      if (reset) {
        setLoading(true);
        setMemories([]);
        setLastDoc(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const { memories: newMemories, lastDoc: newLastDoc } =
          await getMemories(12, reset ? undefined : lastDoc || undefined, sort);

        setMemories((prev) =>
          reset ? newMemories : [...prev, ...newMemories]
        );
        setLastDoc(newLastDoc);
        setHasMore(newMemories.length === 12);
      } catch {
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [lastDoc, sort]
  );

  useEffect(() => {
    loadMemories(true);
    getMemoryCount().then(setTotalCount).catch(() => {});
  }, [sort]);

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMemories(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMemories]);

  const filtered =
    decade === "All"
      ? memories
      : memories.filter((m) => getDecade(m.year) === decade);

  return (
    <main className="page-container">
      <div style={{ marginBottom: "48px" }}>
        <p className="page-eyebrow">Community Wall</p>
        <h1 className="page-title" style={{ fontSize: "var(--text-h2)" }}>
          Celebrating IBM Memories
        </h1>
        <p className="page-subtitle">
          Every product, every year, every story — shared by the IBM family.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--ink-tertiary)",
          }}
        >
          {totalCount} memories shared
        </p>

        <div style={{ display: "flex", gap: "8px" }}>
          {(["newest", "oldest", "most-liked"] as SortOption[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`filter-btn${sort === s ? " active" : ""}`}
              onClick={() => setSort(s)}
            >
              {s === "most-liked" ? "Most Liked" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-bar">
        {DECADES.map((d) => (
          <button
            key={d}
            type="button"
            className={`filter-btn${decade === d ? " active" : ""}`}
            onClick={() => setDecade(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="celebration-loading">Loading memories...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "20px",
              color: "var(--ink-secondary)",
              marginBottom: "24px",
            }}
          >
            No memories yet. Be the first to share yours.
          </p>
          <a href="/submit" className="btn-primary">
            Share My Memory →
          </a>
        </div>
      ) : (
        <div className="masonry-grid">
          {filtered.map((memory) => (
            <div key={memory.id} className="masonry-item">
              <MemoryCard memory={memory} />
            </div>
          ))}
        </div>
      )}

      {loadingMore && (
        <p
          style={{
            textAlign: "center",
            padding: "24px",
            color: "var(--ink-tertiary)",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
          }}
        >
          Loading more...
        </p>
      )}

      <div ref={observerRef} style={{ height: "1px" }} />
    </main>
  );
}