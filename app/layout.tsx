// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "DocAI — AI-Powered Code Documentation",
  description:
    "Generate beautiful, comprehensive documentation for any codebase in seconds. READMEs, API docs, inline comments — all powered by Claude AI.",
  keywords: ["documentation", "AI", "developer tools", "code", "README"],
  openGraph: {
    title: "DocAI — AI-Powered Code Documentation",
    description: "Generate docs for any codebase in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
