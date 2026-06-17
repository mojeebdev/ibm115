export default function Disclaimer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.08em",
          color: "var(--ink-tertiary)",
          maxWidth: "640px",
          margin: "0 auto",
          lineHeight: 1.7,
        }}
      >
        IBM 115 · Remember When is an independent community tribute built in
        honor of IBM&apos;s 115th anniversary. It is not affiliated with,
        endorsed by, or sponsored by International Business Machines
        Corporation. IBM® and all IBM product names are trademarks of IBM.
      </p>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--ink-tertiary)",
          marginTop: "8px",
          opacity: 0.7,
        }}
      >
        Built by BlindspotLab · mojeeb.xyz
      </p>
    </footer>
  );
}