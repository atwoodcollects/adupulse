// app/layout.tsx — wrap your existing layout with ClerkProvider
// Just add the import and the <ClerkProvider> wrapper around {children}

import { ClerkProvider } from "@clerk/nextjs";

// YOUR EXISTING IMPORTS...
// import { Inter } from 'next/font/google'
// import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* YOUR EXISTING NAV, HEADER, ETC */}
          {children}
          {/* YOUR EXISTING FOOTER */}
        </body>
      </html>
    </ClerkProvider>
  );
}
