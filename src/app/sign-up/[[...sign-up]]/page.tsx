// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp
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
