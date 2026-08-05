import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function sendDownloadEmail({
  to,
  customerName,
  productName,
  fileUrl,
}: {
  to: string;
  customerName: string;
  productName: string;
  fileUrl: string | null;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY missing, skipping email send");
    return;
  }

  const downloadSection = fileUrl
    ? `<p style="margin:24px 0;">
         <a href="${fileUrl}" style="background:#e0303f;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
           Download ${productName}
         </a>
       </p>`
    : `<p style="margin:24px 0;color:#c0392b;">
         Download link is being prepared. Our team will send it to you shortly.
       </p>`;

  const html = `
    <div style="font-family: -apple-system, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h2 style="color:#111;">Hi ${customerName || "there"},</h2>
      <p style="color:#333; font-size:15px; line-height:1.6;">
        Your payment for <strong>${productName}</strong> has been verified and approved.
      </p>
      ${downloadSection}
      <p style="color:#777; font-size:13px;">
        If the button above doesn't work, copy and paste this link into your browser:<br/>
        <span style="word-break: break-all;">${fileUrl || "N/A"}</span>
      </p>
      <p style="color:#999; font-size:12px; margin-top:32px;">— SEVENXP</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "SEVENXP <onboarding@resend.dev>",
      to: [to],
      subject: `Your download is ready — ${productName}`,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Resend email failed:", errText);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Order id and status required" }, { status: 400 });
    }

    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: fetchError?.message || "Order not found" }, { status: 404 });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (status === "approved" && order.customer_email) {
      let fileUrl: string | null = null;

      if (order.product_id) {
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("file_url")
          .eq("id", order.product_id)
          .maybeSingle();
        fileUrl = product?.file_url || null;
      }

      await sendDownloadEmail({
        to: order.customer_email,
        customerName: order.customer_name,
        productName: order.product_name,
        fileUrl,
      });
    }

    return NextResponse.json({ order: updated });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update order" },
      { status: 500 }
    );
  }
}