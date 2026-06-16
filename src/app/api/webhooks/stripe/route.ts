// app/api/webhooks/stripe/route.ts
// TODO: Re-implement user metadata sync after Clerk removal
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

// TODO: Re-implement with new auth/user system
async function updateUserSubscription(
  _userId: string,
  _tier: "free" | "pro",
  _stripeSubscriptionId?: string
) {
  // Previously updated Clerk user metadata. Needs replacement.
  console.log(`TODO: Update user ${_userId} to tier ${_tier}`);
}

// Find the user ID from the Stripe customer
async function getUserId(
  customerId: string,
  subscriptionMetadata?: Stripe.Metadata
): Promise<string | null> {
  // First check subscription metadata
  if (subscriptionMetadata?.userId) {
    return subscriptionMetadata.userId;
  }
  // Fallback: check customer metadata
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  return (customer as Stripe.Customer).metadata?.userId || null;
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
        const userId = await getUserId(
          customerId,
          subscription.metadata
        );

        if (!userId) {
          console.error("No user ID found for customer:", customerId);
          break;
        }

        // Active or trialing = Pro
        if (
          subscription.status === "active" ||
          subscription.status === "trialing"
        ) {
          await updateUserSubscription(userId, "pro", subscription.id);
          console.log(`Upgraded user ${userId} to Pro`);
        }
        // Past due, unpaid, canceled = downgrade
        else if (
          subscription.status === "canceled" ||
          subscription.status === "unpaid" ||
          subscription.status === "past_due"
        ) {
          await updateUserSubscription(userId, "free");
          console.log(`Downgraded user ${userId} to Free`);
        }
        break;
      }

      // Subscription deleted (canceled and period ended)
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userId = await getUserId(
          customerId,
          subscription.metadata
        );

        if (userId) {
          await updateUserSubscription(userId, "free");
          console.log(`Subscription ended for user ${userId}`);
        }
        break;
      }

      // Payment failed
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.warn(`Payment failed for customer: ${customerId}`);
        break;
      }

      default:
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
