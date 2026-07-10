"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    let loadingToastId: string | number;

    await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
          loadingToastId = toast.loading("Signing you in...");
        },
        onSuccess: () => {
          toast.success("Successfully logged in!", { id: loadingToastId });
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Invalid email or password.", {
            id: loadingToastId,
          });
        },
        onResponse: () => {
          setIsLoading(false);
        },
      },
    });
  };

  const handleGoogleSignIn = async () => {
    let loadingToastId: string | number;

    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
          loadingToastId = toast.loading("Connecting to Google...");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Google authentication failed.", {
            id: loadingToastId,
          });
        },
        onResponse: () => {
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] px-6 py-20 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-[#c8f542]/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-white/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-110 rounded-2xl border border-white/5 bg-black/40 p-8 backdrop-blur-xl sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-500 group-hover:rotate-180"
            >
              <path
                d="M12 2 4 7v10l8 5 8-5V7l-8-5Z"
                stroke="#c8f542"
                strokeWidth="2"
              />
            </svg>
            <span className="text-[15px] font-bold tracking-[0.3em] text-white">
              KAIRO
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
            Welcome Back
          </h2>
          <p className="text-xs text-white/50 tracking-wide">
            Enter your credentials to access your portal
          </p>
        </div>

        {/* OAuth Provider Action */}
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3.5 text-xs font-semibold tracking-wide text-white transition-all duration-200 hover:bg-white/10 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <span className="relative bg-[#0a0a0a] px-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
            Or Core Login
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-5">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={isLoading}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#c8f542]/50 focus:bg-white/8 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                Password
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-4 pr-12 py-3.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#c8f542]/50 focus:bg-white/8 focus:outline-none"
              />
              {/* আইকন বাটন */}
              <button
                type="button"
                tabIndex={-1}
                disabled={isLoading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 cursor-pointer rounded-xl bg-[#c8f542] py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0a0a0a] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/40 tracking-wide">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-white transition-colors hover:text-[#c8f542]"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
