"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#b3b3b3] transition-colors duration-300 hover:text-[#c8f542]"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <Link
            href="/signin"
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#e5e5e5] transition-colors duration-300 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#c8f542] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0a0a0a] transition-transform duration-300 hover:scale-105"
          >
            Sign Up
          </Link>
        </div>

        {/* Premium Mobile Menu Trigger */}
        <button
          className="lg:hidden z-50 flex h-8 w-8 flex-col items-end justify-center gap-1.5 focus:outline-none cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span
            className={`h-[2px] bg-white transition-all duration-300 ease-out ${
              isOpen ? "w-6 translate-y-[8px] rotate-45" : "w-6"
            }`}
          />
          <span
            className={`h-[2px] bg-white transition-all duration-300 ease-out ${
              isOpen ? "w-0 opacity-0" : "w-4"
            }`}
          />
          <span
            className={`h-[2px] bg-white transition-all duration-300 ease-out ${
              isOpen ? "w-6 -translate-y-[8px] -rotate-45" : "w-5"
            }`}
          />
        </button>
      </div>

      {/* Full-screen Minimalist Overlay Menu */}
      <div
        className={`fixed inset-0  w-screen bg-[#0a0a0a] transition-all duration-500 ease-in-out lg:hidden flex flex-col justify-between px-8 pt-24 pb-80 ${
          isOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Mobile Navigation List */}
        <ul className="flex flex-col gap-6 pb-10">
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
        </ul>

        {/* Mobile Auth Actions (Visible on small screens, hidden when md:flex triggers) */}
        <div
          className={`flex flex-col gap-4 border-t border-white/10 pt-8 md:hidden transition-all duration-700 delay-200 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/signin"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#e5e5e5] border border-white/20 rounded-full hover:border-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3.5 text-[13px] font-bold uppercase tracking-[0.2em] bg-[#c8f542] hover:bg-[#add435] text-[#0a0a0a] rounded-full transition-transform active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
