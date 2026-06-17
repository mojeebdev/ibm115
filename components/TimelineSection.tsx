import Image from "next/image";

interface MilestoneImage {
  desktop: string;
  mobile: string;
  alt: string;
  caption?: string;
  editorial?: boolean;
}

interface Milestone {
  year: string;
  text: string;
  image?: MilestoneImage;
}

interface Era {
  range: string;
  title: string;
  milestones: Milestone[];
}

const ERAS: Era[] = [
  {
    range: "1911–1924",
    title: "FOUNDATIONS",
    milestones: [
      {
        year: "1911",
        text: "Computing-Tabulating-Recording Company (CTR) founded on June 16 — the birth of what would become IBM.",
      },
      {
        year: "1924",
        text: "Renamed International Business Machines Corporation, reflecting a global vision for business machines.",
      },
    ],
  },
  {
    range: "1924–1944",
    title: "THE IBM NAME",
    milestones: [
      {
        year: "1930s",
        text: "IBM expanded its tabulating machine business through the Great Depression, proving resilience through innovation.",
      },
      {
        year: "1944",
        text: "Harvard Mark I — the first large-scale automatic digital computer in the United States, built in partnership with Harvard University.",
      },
    ],
  },
  {
    range: "1944–1964",
    title: "THE MAINFRAME ERA",
    milestones: [
      {
        year: "1956",
        text: "IBM 305 RAMAC introduced the first commercial hard disk drive — 5 megabytes on fifty 24-inch platters.",
      },
      {
        year: "1961",
        text: "IBM Selectric typewriter revolutionized office communication worldwide with its interchangeable typeball and distinctive design.",
      },
    ],
  },
  {
    range: "1964–1981",
    title: "SYSTEM/360 & BEYOND",
    milestones: [
      {
        year: "1964",
        text: "System/360 mainframe — a family of compatible computers that transformed enterprise computing forever.",
      },
      {
        year: "1969",
        text: "IBM technology supported the Apollo Guidance Computer, helping humanity reach the moon.",
      },
    ],
  },
  {
    range: "1981–1995",
    title: "THE PC REVOLUTION",
    milestones: [
      {
        year: "1981",
        text: "IBM Personal Computer 5150 launched the PC era — an open architecture that changed how the world worked.",
        image: {
          desktop: "/images/ibm-pc-cga-desktop.jpg",
          mobile: "/images/ibm-pc-cga-mobile.jpg",
          alt: "IBM Personal Computer 5150 with CGA display",
          caption: "IBM Personal Computer 5150 · 1981",
          editorial: true,
        },
      },
      {
        year: "1997",
        text: "Deep Blue defeated world chess champion Garry Kasparov — a landmark moment for artificial intelligence.",
      },
    ],
  },
  {
    range: "1995–2011",
    title: "INTERNET & SERVICES",
    milestones: [
      {
        year: "1990s",
        text: "IBM pivoted toward services and consulting, helping enterprises navigate the internet revolution.",
      },
      {
        year: "2000s",
        text: "Global services expansion and middleware leadership positioned IBM as the backbone of enterprise IT.",
      },
    ],
  },
  {
    range: "2011–2020",
    title: "WATSON & CLOUD",
    milestones: [
      {
        year: "2011",
        text: "Watson won Jeopardy! — demonstrating that AI could understand natural language at a human level.",
      },
      {
        year: "2019",
        text: "IBM unveiled the first commercial quantum computer — IBM Q System One.",
      },
    ],
  },
  {
    range: "2020–2026",
    title: "QUANTUM & AI",
    milestones: [
      {
        year: "2023",
        text: "watsonx AI platform launched — enterprise-grade AI for the next generation of business.",
      },
      {
        year: "2026",
        text: "115 years of innovation. From punch cards to quantum computing — and the stories keep coming.",
      },
    ],
  },
];

export default function TimelineSection() {
  return (
    <div>
      {ERAS.map((era) => (
        <section key={era.range} className="timeline-era">
          <p className="timeline-era-label">
            {era.range} · {era.title}
          </p>

          {era.milestones.map((m) => (
            <div key={m.year} className="timeline-milestone">
              <p className="timeline-milestone-year">{m.year}</p>

              {m.image && (
                <figure className="timeline-figure">
                  <div
                    className={`timeline-image-wrap${m.image.editorial ? " timeline-image-editorial" : ""}`}
                    style={{ width: "100%", height: "auto" }}
                  >
                    <Image
                      src={m.image.desktop}
                      alt={m.image.alt}
                      width={640}
                      height={480}
                      sizes="(max-width: 768px) 100vw, 640px"
                      className="timeline-ref-desktop"
                      style={{ width: "100%", height: "auto" }}
                    />
                    <Image
                      src={m.image.mobile}
                      alt={m.image.alt}
                      width={640}
                      height={480}
                      sizes="100vw"
                      className="timeline-ref-mobile"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  {m.image.caption && (
                    <figcaption className="timeline-caption">
                      {m.image.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              <p className="timeline-milestone-text">{m.text}</p>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}