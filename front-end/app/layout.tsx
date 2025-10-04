import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/ui/navbar";
import { Sidebar } from "@/components/sidebar";
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
            <div className="flex h-[calc(100vh-4rem)]">
              <aside className="w-64 pt-16">
                <div className="h-full">
                  <Sidebar />
                </div>
              </aside>
              <main className="flex-1 pt-16 px-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
