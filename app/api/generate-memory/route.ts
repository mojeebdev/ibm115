import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const SYSTEM_INSTRUCTION = `You are IBM's institutional memory — a warm, authoritative voice that speaks to the company's 115-year legacy. You write with editorial precision: concise, historically grounded, never corporate-sounding. No lists. Pure prose. Maximum 3 short paragraphs.`;

const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

async function generateWithFallback(prompt: string): Promise<string> {
  let lastError: unknown;

  for (const modelName of FALLBACK_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        lastError = error;
        const status = (error as { status?: number })?.status;
        if (status === 503 || status === 429) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  try {
    const { name, product, year, price } = await req.json();
    const priceClause = price ? `, for ${price}` : "";

    const prompt = `A community member named ${name} shared that their first IBM product was the ${product}, which they got in ${year}${priceClause}.

Write them a brief, personal historical note that:
1. Acknowledges their specific product and what it meant in that era
2. Shares 1–2 genuinely interesting things IBM achieved or launched around ${year}
3. Ends with a warm line connecting their memory to IBM's 115-year journey

Keep it under 150 words. No bullet points. Pure prose. Begin directly — no greeting, no "Dear", no "Congratulations".`;

    const text = await generateWithFallback(prompt);
    return Response.json({ text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      { error: "Failed to generate memory response" },
      { status: 500 }
    );
  }
}