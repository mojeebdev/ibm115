import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Disclaimer from "@/components/Disclaimer";
import Navbar from "@/components/Navbar";
import "./globals.css";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://ibm115.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "IBM 115 | Remember When",
  description:
    "IBM turns 115. Share your first IBM product memory and join the community wall.",
  openGraph: {
    title: "IBM 115 | Remember When",
    description:
      "What was the first IBM product you ever owned? Tell us. We're listening.",
    type: "website",
    images: ["/images/ibm-tunnel-desktop.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/ibm-tunnel-desktop.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=array@300,400,500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Disclaimer />
        <Analytics />
      </body>
    </html>
  );
}