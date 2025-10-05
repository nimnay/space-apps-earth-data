"use client";

import Link from "next/link";
import { ThemeDropdown } from "../theme-dropdown";
import {
  LayoutDashboard,
  Map,
  BarChart2,
  FileText,
  MessageSquare,
  Globe,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    { href: "/map", label: "Maps", icon: <Map className="w-4 h-4" /> },
    {
      href: "/aqi-anderson",
      label: "Anderson",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      href: "/report",
      label: "Report",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      href: "/chat",
      label: "Chat",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    { href: "/global", label: "Global", icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            AeroGuard
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors
                  ${
                    isActive(item.href)
                      ? "bg-secondary text-primary"
                      : "hover:bg-secondary/50 hover:text-primary"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <ThemeDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
