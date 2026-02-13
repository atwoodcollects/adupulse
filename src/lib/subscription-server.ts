import { clerkClient } from "@clerk/nextjs/server";

export type SubscriptionTier = "free" | "pro";

export async function getSubscriptionTier(
  userId: string
): Promise<SubscriptionTier> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata?.subscriptionTier as SubscriptionTier) || "free";
}
