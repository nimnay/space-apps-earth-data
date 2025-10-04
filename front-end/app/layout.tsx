import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/ui/navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Earth Data",
  description: "NASA Space Apps Project by Clemson Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
