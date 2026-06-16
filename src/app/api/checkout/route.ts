// app/api/checkout/route.ts
// TODO: Re-implement auth check after Clerk removal
import { NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    // TODO: Auth check removed (was Clerk). Re-implement with new auth provider.
    const { plan } = await req.json();

    if (plan !== "pro_monthly" && plan !== "pro_annual") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = PLANS[plan as keyof typeof PLANS].priceId;

    // Create checkout session without user association
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
