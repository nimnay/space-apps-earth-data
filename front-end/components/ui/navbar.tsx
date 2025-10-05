"use client"

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
      label: "Emergency",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    { href: "/map", label: "Fire Map", icon: <Map className="w-4 h-4" /> },
    {
      href: "/aqi-anderson",
      label: "Air Quality",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      href: "/report",
      label: "Reports",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      href: "/chat",
      label: "Emergency Chat",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    { href: "/global", label: "Global", icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="font-black text-2xl text-slate-800 hover:scale-105 transition-all duration-300"
                  >
                    AEROGUARD
                  </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                        className={`px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 transition-all duration-300 text-slate-700
                          ${
                            isActive(item.href)
                              ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-xl fire-glow"
                              : "hover:bg-gradient-to-r hover:from-slate-600/20 hover:to-slate-700/20 hover:text-slate-800 hover:scale-105"
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
