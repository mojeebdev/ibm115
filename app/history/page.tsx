import Link from "next/link";
import TimelineSection from "@/components/TimelineSection";

export default function HistoryPage() {
  return (
    <main className="page-container">
      <div style={{ marginBottom: "64px" }}>
        <p className="page-eyebrow">The IBM Story</p>
        <h1 className="page-title">
          115 Years of Ideas That Changed Everything.
        </h1>
        <p className="page-subtitle">
          From punch cards to quantum computing.
        </p>
      </div>

      <TimelineSection />

      <div className="history-cta">
        <p>This is history. What&apos;s YOUR memory?</p>
        <Link href="/submit" className="btn-primary">
          Share My Memory →
        </Link>
      </div>
    </main>
  );
}