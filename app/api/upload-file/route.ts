import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/**
 * Step 1 of a direct-to-storage upload flow.
 * Instead of streaming the whole file through this Next.js route (which
 * hits body-size limits on serverless hosts like Vercel — usually ~4.5MB),
 * we ask Supabase for a short-lived SIGNED UPLOAD URL and hand that back
 * to the browser. The browser then uploads the file directly to Supabase
 * Storage, so file size is only limited by your Supabase project's own
 * storage limits (Dashboard > Storage > Settings), not by this server.
 */
export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: "fileName is required" }, { status: 400 });
    }

    const ext = fileName.split(".").pop();
    const path = `files/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabaseAdmin.storage
      .from("product-files")
      .createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Could not create upload URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
