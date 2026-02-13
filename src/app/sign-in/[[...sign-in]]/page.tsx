// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
            headerTitle: "text-gray-900",
            headerSubtitle: "text-gray-500",
            formButtonPrimary:
              "bg-amber-600 hover:bg-amber-700 text-white",
          },
        }}
      />
    </div>
  );
}
