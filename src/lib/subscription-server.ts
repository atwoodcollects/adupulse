export type SubscriptionTier = "free" | "pro";

export async function getSubscriptionTier(
  _userId: string
): Promise<SubscriptionTier> {
  // TODO: Re-implement subscription tier lookup after Clerk removal
  return "free";
}
