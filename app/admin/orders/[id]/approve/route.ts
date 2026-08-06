import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

// How long the download link stays valid after approval, in seconds.
const LINK_EXPIRY_SECONDS = 60 * 60 * 48; // 48 hours

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    // 1. Load the order + its product
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*, products(*)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const product = order.products;
    if (!product?.file_url) {
      return NextResponse.json(
        { error: "This product has no deliverable file uploaded yet." },
        { status: 400 }
      );
    }

    // 2. Generate a signed, time-limited download URL from the PRIVATE bucket
    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("product-files")
      .createSignedUrl(product.file_url, LINK_EXPIRY_SECONDS, {
        download: product.file_name || true,
      });

    if (signError || !signed) {
      return NextResponse.json(
        { error: signError?.message || "Could not create download link" },
        { status: 500 }
      );
    }

    const expiresAt = new Date(Date.now() + LINK_EXPIRY_SECONDS * 1000).toISOString();

    // 3. Update the order: approved + store the delivered link for records
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "approved",
        download_url: signed.signedUrl,
        download_expires_at: expiresAt,
        delivered_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 4. Email the buyer their download link
    await resend.emails.send({
      from: "SEVENXP <orders@sevenxp.com>", // must be a domain verified in Resend
      to: order.email,
      subject: `Your download is ready — ${product.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background:#0a0a0a; padding:32px; color:#fafafa;">
          <h2 style="color:#e0303f; margin-bottom:4px;">Order Approved ✓</h2>
          <p style="color:#cfcfcf;">Hi ${order.name || "there"},</p>
          <p style="color:#cfcfcf;">
            Your payment for <strong>${product.name}</strong> has been verified.
            Your download is ready below.
          </p>
          <p style="margin: 24px 0;">
            <a href="${signed.signedUrl}"
               style="background:#e0303f;color:#fff;padding:14px 28px;border-radius:8px;
                      text-decoration:none;font-weight:700;display:inline-block;">
              Download ${product.file_name || "your file"}
            </a>
          </p>
          <p style="color:#888; font-size:13px;">
            This link expires in 48 hours. If it expires, reply to this email
            and we'll send you a fresh one.
          </p>
          <p style="color:#555; font-size:12px; margin-top:32px;">
            SEVENXP · Order #${order.id}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, downloadUrl: signed.signedUrl });
  } catch (err: any) {
  return NextResponse.json({ error: err.message || "Approval failed" }, { status: 500 });
}
}