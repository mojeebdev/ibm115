"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/submit", label: "Submit" },
  { href: "/celebration", label: "Celebrate" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const showGlass = scrolled || !isLanding;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "var(--nav-height)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
        background: showGlass ? "rgba(15, 15, 15, 0.6)" : "transparent",
        backdropFilter: showGlass ? "blur(12px)" : "none",
        borderBottom: showGlass
          ? "1px solid var(--border-subtle)"
          : "1px solid transparent",
      }}
    >
      <nav
        style={{
          width: "100%",
          maxWidth: "var(--content-max)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            letterSpacing: "-0.02em",
            color: "var(--ink-primary)",
          }}
        >
          IBM <span style={{ color: "var(--ibm-blue)" }}>|</span> 115
        </Link>

        <div
          className="nav-desktop"
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:
                  pathname === link.href
                    ? "var(--ibm-blue-bright)"
                    : "var(--ink-secondary)",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="nav-mobile-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              background: "var(--ink-primary)",
              transition: "transform 0.2s ease",
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              background: "var(--ink-primary)",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.2s ease",
            }}
          />
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              background: "var(--ink-primary)",
              transition: "transform 0.2s ease",
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}
          />
        </button>
      </nav>

      {menuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            position: "absolute",
            top: "var(--nav-height)",
            left: 0,
            right: 0,
            background: "rgba(15, 15, 15, 0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:
                  pathname === link.href
                    ? "var(--ibm-blue-bright)"
                    : "var(--ink-secondary)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}