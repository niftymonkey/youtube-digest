import type { Metadata } from "next";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/theme-provider";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/source-sans-3";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube Digest",
  description: "Quickly understand any YouTube video. AI-powered summaries, timestamps, and extracted links.",
  openGraph: {
    title: "YouTube Digest",
    description: "Quickly understand any YouTube video. AI-powered summaries, timestamps, and extracted links.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="antialiased min-h-screen bg-[var(--color-bg-primary)]">
        <AuthKitProvider>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
                {children}
              </div>
            </ThemeProvider>
          </NuqsAdapter>
        </AuthKitProvider>
      </body>
    </html>
  );
}
