import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const { productId, productName, name, email, transactionId, paymentMethod, amount } = await req.json();

  if (!productId || !name || !email || !transactionId) {
    return NextResponse.json({ error: "সব field পূরণ করুন" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      product_id: productId,
      product_name: productName,
      customer_name: name,
      customer_email: email,
      amount,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}