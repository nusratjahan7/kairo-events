"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  Users,
  LogOut,
  Menu,
  X,
  BarChart3,
  User,
  CalendarDays,
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface MenuConfig {
  user: MenuItem[];
  admin: MenuItem[];
  [key: string]: MenuItem[];
}

interface EventDashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "user" | "admin";
}

interface MenuContentProps {
  navItems: MenuItem[];
  pathname: string;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuContent = ({
  navItems,
  pathname,
  setIsMobileMenuOpen,
}: MenuContentProps) => (
  <div className="bg-(--background) rounded-3xl border border-gray-700 p-6 shadow-sm w-full">
    {/* Header / Brand Title */}
    <div className="flex items-center gap-3 pb-5 border-b border-gray-700-100 mb-6">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 4 7v10l8 5 8-5V7l-8-5Z"
          stroke="#c8f542"
          strokeWidth="2"
        />
      </svg>
      <span className="font-bold text-(--foreground) text-base tracking-tight">
        Kairo Events
      </span>
    </div>

    {/* Navigation Links */}
    <nav className="flex flex-col gap-1.5 mb-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-(--text-primary) text-[#0a0a0a]"
                : "text-slate-500 hover:bg-slate-200 hover:text-slate-800"
            }`}
          >
            <Icon
              size={18}
              className={isActive ? "text-[#0a0a0a]" : "text-slate-400"}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>

    {/* Exit Action Button */}
    <div className="pt-4 border-t border-gray-700">
      <Link
        href="/"
        className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors w-full"
      >
        <LogOut size={18} />
        <span>Exit Dashboard</span>
      </Link>
    </div>
  </div>
);

export default function EventDashboardLayout({
  children,
  userRole = "user",
}: EventDashboardLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const menuConfig: MenuConfig = {
    user: [
      { label: "Overview", path: "/dashboard/user", icon: LayoutDashboard },
      { label: "My Tickets", path: "/dashboard/user/tickets", icon: Ticket },
      { label: "Profile", path: "/dashboard/user/profile", icon: User },
    ],
    admin: [
      { label: "Dashboard", path: "/dashboard/admin", icon: BarChart3 },
      {
        label: "Manage Events",
        path: "/dashboard/admin/manage",
        icon: CalendarDays,
      },
      {
        label: "Create Event",
        path: "/dashboard/admin/create",
        icon: PlusCircle,
      },
      { label: "Bookings", path: "/dashboard/admin/bookings", icon: Ticket },
      { label: "Users", path: "/dashboard/admin/users", icon: Users },
    ],
  };

  const navItems: MenuItem[] = menuConfig[userRole] || menuConfig["user"];

  return (
    <div className="min-h-screen bg-(--background) text-slate-800 antialiased p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden col-span-1 w-full flex flex-col gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-(--background) text-(--foreground) rounded-full border border-slate-100 hover:border-(--text-primary) px-5 py-3.5 flex items-center gap-3 shadow-sm hover:text-(--text-primary) transition-colors text-left select-none cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X size={18} className="text-text-(--foreground)" />
            ) : (
              <Menu size={18} className="text-text-(--foreground)" />
            )}
            <span className="text-sm font-bold text-(--foreground) hover:text-(--text-primary)">
              Navigation
            </span>
          </button>

          {isMobileMenuOpen && (
            <div className="w-full animate-in fade-in slide-in-from-top-2 duration-200">
              <MenuContent
                navItems={navItems}
                pathname={pathname}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </div>
          )}
        </div>

        {/* Sidebar Desktop */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-8 w-full">
          <MenuContent
            navItems={navItems}
            pathname={pathname}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </aside>

        {/* Main Content */}
        <main className="col-span-1 lg:col-span-9 w-full bg-(--background) rounded-3xl border border-gray-700 p-6 sm:p-8 shadow-sm min-h-[70vh]">
          {children}
        </main>
      </div>
    </div>
  );
}
