import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemoryBySlug } from "@/lib/firestore";
import MemorySlugTypewriter from "@/components/MemorySlugTypewriter";
import ShareButton from "@/components/ShareButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const memory = await getMemoryBySlug(slug);

  if (!memory) {
    return { title: "Memory Not Found · IBM 115" };
  }

  return {
    title: `${memory.name}'s IBM Memory · ${memory.year}`,
    description: memory.aiResponse.substring(0, 160),
    openGraph: {
      title: `${memory.name} remembers the ${memory.product} (${memory.year})`,
      description: memory.aiResponse.substring(0, 200),
      images: memory.photoUrl
        ? [memory.photoUrl]
        : ["/images/selectric-reference-thumbnail.jpg"],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${memory.name} remembers the ${memory.product} (${memory.year})`,
      description: memory.aiResponse.substring(0, 200),
    },
  };
}

export default async function MemoryPage({ params }: PageProps) {
  const { slug } = await params;
  const memory = await getMemoryBySlug(slug);

  if (!memory) {
    notFound();
  }

  return (
    <main className="page-container" style={{ maxWidth: "720px" }}>
      <p className="page-eyebrow">
        {memory.name} · {memory.year}
      </p>
      <h1
        className="page-title"
        style={{ fontSize: "var(--text-h2)", marginBottom: "8px" }}
      >
        {memory.product}
      </h1>

      {memory.photoUrl && (
        <div
          style={{
            position: "relative",
            height: "320px",
            borderRadius: "8px",
            overflow: "hidden",
            margin: "32px 0",
          }}
        >
          <Image
            src={memory.photoUrl}
            alt={`${memory.name}'s IBM memory`}
            fill
            style={{ objectFit: "cover" }}
            sizes="720px"
            priority
          />
        </div>
      )}

      <MemorySlugTypewriter memory={memory} />

      <p className="memory-slug-hint">
        Save a PNG of this memory anytime using the button above.
      </p>

      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <ShareButton memory={memory} />
        <Link
          href="/celebration"
          className="btn-ghost"
          style={{ padding: "10px 20px", fontSize: "10px" }}
        >
          See All Memories
        </Link>
      </div>
    </main>
  );
}