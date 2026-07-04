"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { BarChart2, BookMarked, Clock, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/watchlist",  label: "Watchlist",  icon: BookMarked },
  { href: "/history",    label: "History",    icon: Clock },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = async () => { await logout(); router.push("/auth/login"); };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BarChart2 size={18} className="text-accent" />
          <span className="font-semibold text-sm tracking-tight">StockSense</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-accent/8 text-accent"
                  : "text-muted hover:text-ink hover:bg-surface"
              )}>
              <Icon size={14} />
              {label}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link href="/admin"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-accent/8 text-accent"
                  : "text-muted hover:text-ink hover:bg-surface"
              )}>
              <Shield size={14} />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden md:block text-xs text-muted truncate max-w-[160px]">
              {user.fullName}
            </span>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-danger transition-colors">
            <LogOut size={14} />
            <span className="hidden md:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
