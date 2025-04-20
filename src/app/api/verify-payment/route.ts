import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import {User} from "@/models/user";

export async function POST(req: Request) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    email,
    tokens,
  } = await req.json();

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
  }

  await dbConnect();

  await User.findOneAndUpdate(
    { email },
    {
      $inc: { tokenBalance: tokens },
      $set: { isPremium: true },
    },
    { new: true, upsert: true }
  );

  return NextResponse.json({ success: true });
}
