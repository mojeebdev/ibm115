export function generateSlug(name: string, year: number): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 20);
  return `${base}-${year}-${Date.now().toString(36)}`;
}

export interface MemoryShare {
  slug: string;
  name: string;
  product: string;
  year: number;
}

export function generateXShareText(memory: MemoryShare): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://ibm115.vercel.app";
  const shareUrl = `${baseUrl}/m/${memory.slug}`;
  return `My first IBM product was the ${memory.product} in ${memory.year}.

IBM just turned 115 — share your memory: ${shareUrl}

IBM computing technology innovation ${memory.year}`;
}

export function getDecade(year: number): string {
  if (year < 1970) return "1910s–1960s";
  if (year < 1980) return "1970s";
  if (year < 1990) return "1980s";
  if (year < 2000) return "1990s";
  if (year < 2010) return "2000s";
  return "2010s+";
}

export function slugifyFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 30);
}