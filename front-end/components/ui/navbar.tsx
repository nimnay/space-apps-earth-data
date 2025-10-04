import Link from "next/link";
import { ThemeDropdown } from "../theme-dropdown";

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            Earth Data
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              AeroGuard Chat
            </Link>
            <ThemeDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
