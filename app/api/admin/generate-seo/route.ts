import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, category, description, techStack, price } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Product title required" }, { status: 400 });
    }

    const prompt = `You are an expert SEO strategist for digital marketplaces like ThemeForest, Envato, and Creative Market, specializing in ranking product pages #1 on Google and driving high daily organic traffic (targeting thousands of visits per day).

Product: ${title}
Category: ${category || "N/A"}
Format/Tech: ${techStack || "N/A"}
Price: $${price || "N/A"}
Current Description: ${description || "N/A"}

Generate SEO metadata using proven high-search-volume, buyer-intent keywords that real customers search when ready to purchase this type of digital product. Prioritize keywords that combine the product type + use case + platform (e.g. "canva youtube intro template", "video intro maker download").

Respond ONLY with valid JSON, no markdown, no preamble:
{
  "seo_title": "compelling SEO title under 60 characters with primary keyword",
  "seo_description": "compelling meta description under 155 characters with CTA and primary keywords",
  "seo_keywords": "10-12 high-intent keywords comma separated, ordered by search volume",
  "enhanced_description": "3 paragraph professional, benefit-driven product description optimized for conversions and SEO"
}`;

    const response = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        input: prompt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Grok API error: ${errText}`);
    }

    const data = await response.json();

    // Responses API returns output in a structured array — extract the text
    const outputText =
      data.output?.[0]?.content?.[0]?.text ||
      data.output_text ||
      data.text ||
      "";

    if (!outputText) {
      throw new Error("No text returned from Grok API: " + JSON.stringify(data));
    }

    const cleaned = outputText.replace(/```json|```/g, "").trim();
    const seoData = JSON.parse(cleaned);

    return NextResponse.json(seoData);
  } catch (err: any) {
    console.error("Generate SEO error:", err);
    return NextResponse.json({ error: err.message || "AI failed" }, { status: 500 });
  }
}