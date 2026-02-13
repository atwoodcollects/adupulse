// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

// Clerk SDK for updating user metadata
async function updateUserSubscription(
  clerkUserId: string,
  tier: "free" | "pro",
  stripeSubscriptionId?: string
) {
  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      subscriptionTier: tier,
      stripeSubscriptionId: stripeSubscriptionId || null,
    },
  });
}

// Find the Clerk user ID from the Stripe customer
async function getClerkUserId(
  customerId: string,
  subscriptionMetadata?: Stripe.Metadata
): Promise<string | null> {
  // First check subscription metadata (most reliable)
  if (subscriptionMetadata?.clerkUserId) {
    return subscriptionMetadata.clerkUserId;
  }
  // Fallback: check customer metadata
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  return (customer as Stripe.Customer).metadata?.clerkUserId || null;
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Subscription created or updated (payment succeeded)
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const clerkUserId = await getClerkUserId(
          customerId,
          subscription.metadata
        );

        if (!clerkUserId) {
          console.error("No Clerk user ID found for customer:", customerId);
          break;
        }

        // Active or trialing = Pro
        if (
          subscription.status === "active" ||
          subscription.status === "trialing"
        ) {
          await updateUserSubscription(clerkUserId, "pro", subscription.id);
          console.log(`✅ Upgraded user ${clerkUserId} to Pro`);
        }
        // Past due, unpaid, canceled = downgrade
        else if (
          subscription.status === "canceled" ||
          subscription.status === "unpaid" ||
          subscription.status === "past_due"
        ) {
          await updateUserSubscription(clerkUserId, "free");
          console.log(`⬇️ Downgraded user ${clerkUserId} to Free`);
        }
        break;
      }

      // Subscription deleted (canceled and period ended)
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const clerkUserId = await getClerkUserId(
          customerId,
          subscription.metadata
        );

        if (clerkUserId) {
          await updateUserSubscription(clerkUserId, "free");
          console.log(`❌ Subscription ended for user ${clerkUserId}`);
        }
        break;
      }

      // Payment failed
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.warn(`⚠️ Payment failed for customer: ${customerId}`);
        // Optional: send email notification, don't downgrade immediately
        // Stripe will retry per your retry settings
        break;
      }

      default:
        // Unhandled event type — that's fine
        break;
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
