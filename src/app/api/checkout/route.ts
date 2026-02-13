// app/api/checkout/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const { plan } = await req.json();

    if (plan !== "pro_monthly" && plan !== "pro_annual") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = PLANS[plan].priceId;

    // Check if user already has a Stripe customer ID stored in metadata
    let customerId = user?.publicMetadata?.stripeCustomerId as
      | string
      | undefined;

    if (!customerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user?.emailAddresses[0]?.emailAddress,
        metadata: {
          clerkUserId: userId,
        },
      });
      customerId = customer.id;

      // Store customer ID in Clerk metadata
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          stripeCustomerId: customerId,
        },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
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
      metadata: {
        clerkUserId: userId,
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
        },
      },
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
