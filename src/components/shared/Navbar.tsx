"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const loadingToast = toast.loading("Signing out...");
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully!", { id: loadingToast });
            setDropdownOpen(false);
            setIsOpen(false);
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to sign out.", {
              id: loadingToast,
            });
          },
        },
      });
    } catch {
      toast.error("Something went wrong.", { id: loadingToast });
    }
  };

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "U";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isOpen
          ? "bg-[#0a0a0a]/95 backdrop-blur-md py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-350 items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 z-50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 4 7v10l8 5 8-5V7l-8-5Z"
              stroke="#c8f542"
              strokeWidth="2"
            />
          </svg>
          <span className="text-[14px] font-bold tracking-[0.3em] text-white">
            KAIRO
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[(--foreground)] transition-colors duration-300 hover:text-[#c8f542]"
              >
                {link.name}
              </Link>
            </li>
          ))}

          {isAdmin && (
            <>
              <li>
                <Link
                  href="/admin/create"
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-[(--foreground)] transition-colors duration-300 hover:text-[#c8f542]"
                >
                  Create
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/manage"
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-[(--foreground)]transition-colors duration-300 hover:text-[#c8f542]"
                >
                  Manage
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Desktop Auth / User Action Button */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none cursor-pointer group"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    className="h-9 w-9 rounded-full object-cover border border-white/10 group-hover:border-[#c8f542]/50 transition-colors"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#c8f542]/20 to-[#c8f542]/5 border border-[#c8f542]/30 text-xs font-bold text-[#c8f542] group-hover:bg-[#c8f542]/20 transition-all">
                    {getInitial(user.name || "")}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-xl border border-white/5 bg-[#0e0e0e] p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs font-semibold text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-white/40 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium text-[(--foreground)] hover:bg-white/5 hover:text-[#c8f542] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium text-[(--foreground)] hover:bg-white/5 hover:text-[#c8f542] transition-colors"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#e5e5e5] transition-colors duration-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-[#c8f542] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0a0a0a] transition-transform duration-300 hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Premium Mobile Menu Trigger */}
        <button
          className="lg:hidden z-50 flex h-8 w-8 flex-col items-end justify-center gap-1.5 focus:outline-none cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span
            className={`h-0.5 bg-white transition-all duration-300 ease-out ${
              isOpen ? "w-6 translate-y-2 rotate-45" : "w-6"
            }`}
          />
          <span
            className={`h-0.5 bg-white transition-all duration-300 ease-out ${
              isOpen ? "w-0 opacity-0" : "w-4"
            }`}
          />
          <span
            className={`h-0.5 bg-white transition-all duration-300 ease-out ${
              isOpen ? "w-6 -translate-y-2 -rotate-45" : "w-5"
            }`}
          />
        </button>
      </div>

      {/* Full-screen Minimalist Overlay Menu (Mobile) */}
      <div
        className={`fixed inset-0 w-screen bg-[#0a0a0a] transition-all duration-500 ease-in-out lg:hidden flex flex-col justify-between px-8 pt-24 ${
          user ? (user.role === "admin" ? "pb-120" : "pb-96") : "pb-70"
        } ${
          isOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Mobile Navigation List */}
        <ul className="flex flex-col gap-6 pb-9">
          {NAV_LINKS.map((link, index) => (
            <li
              key={link.name}
              style={{
                transitionDelay: isOpen ? `${index * 60}ms` : "0ms",
                transform: isOpen ? "translateY(0)" : "translateY(20px)",
                opacity: isOpen ? 1 : 0,
              }}
              className="transition-all duration-500 ease-out"
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-bold uppercase tracking-[0.15em] text-[#e5e5e5] active:text-[#c8f542] hover:text-[#c8f542] inline-block"
              >
                {link.name}
              </Link>
            </li>
          ))}

          {user && (
            <>
              <li
                style={{
                  transitionDelay: isOpen
                    ? `${NAV_LINKS.length * 60}ms`
                    : "0ms",
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: isOpen ? 1 : 0,
                }}
                className="transition-all duration-500 ease-out"
              >
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="font-bold uppercase tracking-[0.15em] text-[(--foreground)] hover:text-[#c8f542]"
                >
                  Dashboard
                </Link>
              </li>
              <li
                style={{
                  transitionDelay: isOpen
                    ? `${(NAV_LINKS.length + 1) * 60}ms`
                    : "0ms",
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: isOpen ? 1 : 0,
                }}
                className="transition-all duration-500 ease-out"
              >
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="font-bold uppercase tracking-[0.15em] text-[(--foreground)] hover:text-[#c8f542]"
                >
                  My Profile
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <>
              <li
                style={{
                  transitionDelay: isOpen
                    ? `${(NAV_LINKS.length + 2) * 60}ms`
                    : "0ms",
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: isOpen ? 1 : 0,
                }}
                className="transition-all duration-500 ease-out"
              >
                <Link
                  href="/admin/create"
                  onClick={() => setIsOpen(false)}
                  className="font-bold uppercase tracking-[0.15em] text-[(--foreground)] hover:text-[#c8f542]"
                >
                  Create
                </Link>
              </li>
              <li
                style={{
                  transitionDelay: isOpen
                    ? `${(NAV_LINKS.length + 3) * 60}ms`
                    : "0ms",
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: isOpen ? 1 : 0,
                }}
                className="transition-all duration-500 ease-out"
              >
                <Link
                  href="/admin/manage"
                  onClick={() => setIsOpen(false)}
                  className="font-bold uppercase tracking-[0.15em] text-[(--foreground)] hover:text-[#c8f542]"
                >
                  Manage
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Auth Bottom Section */}
        <div
          className={`flex flex-col gap-4 border-t border-white/10 pt-8 transition-all duration-700 delay-200 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#c8f542]/20 to-[#c8f542]/5 border border-[#c8f542]/30 text-sm font-bold text-[#c8f542]">
                    {getInitial(user.name || "")}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-white/40">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-center py-3.5 text-[13px] font-bold uppercase tracking-[0.2em] bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/20 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#e5e5e5] border border-white/20 rounded-full hover:border-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3.5 text-[13px] font-bold uppercase tracking-[0.2em] bg-[#c8f542] hover:bg-[#add435] text-[#0a0a0a] rounded-full transition-transform active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
