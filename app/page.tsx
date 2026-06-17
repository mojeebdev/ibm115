import Link from "next/link";
import HeroTunnel from "@/components/HeroTunnel";
import CgaHeroStrip from "@/components/CgaHeroStrip";

export default function LandingPage() {
  return (
    <main className="hero-bg hero-landing">
      <HeroTunnel />

      <div className="hero-content">
        <p className="hero-eyebrow">
          INTERNATIONAL BUSINESS MACHINES · 1911–2026
        </p>

        <h1 className="hero-title">
          115 Years of
          <br />
          Computing History.
        </h1>

        <p className="hero-subline">
          What was the first IBM product you ever owned?
          <br />
          Tell us. We&apos;re listening.
        </p>

        <div className="hero-actions">
          <CgaHeroStrip />
          <div className="hero-ctas">
            <Link href="/submit" className="btn-primary">
              Share My Memory →
            </Link>
            <Link href="/celebration" className="btn-ghost">
              See All Memories
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}