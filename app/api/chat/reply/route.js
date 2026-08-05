import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message, name } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const systemPrompt = `You are "Zara" — the friendly AI assistant for SEVENXP, a freelance agency offering Graphic Design, Web Development, and Video Editing services. Reply to visitor questions briefly, warmly, and helpfully in English (unless the visitor writes in Bengali/Banglish, in which case reply in that same style). Keep it to 2-3 sentences max. If asked about pricing or timelines, say a team member will follow up with details soon. Never commit to a specific price or deadline.`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Visitor name: ${name || "Guest"}\nMessage: ${message}` },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Grok API error: ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) throw new Error("No reply generated");

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI reply generation failed:", err);
    return NextResponse.json(
      { reply: "Our admin is currently assisting other clients. Please wait a moment. If your request is urgent, feel free to contact us via email or WhatsApp. We appreciate your patience.😊" },
      { status: 200 }
    );
  }
}