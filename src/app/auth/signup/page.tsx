"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const validateInputs = (): boolean => {
    setPasswordError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }

    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    const isValid = validateInputs();
    if (!isValid) return;

    const loadingToast = toast.loading("Creating your profile account...");
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/auth/signin",
        fetchOptions: {
          onSuccess: (ctx) => {
            toast.success("Account created successfully!", {
              id: loadingToast,
            });

            setTimeout(() => {
              router.push("/auth/signin");
              router.refresh();
            }, 1200);
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message || "Could not complete registration.",
              { id: loadingToast },
            );
            setIsLoading(false);
          },
        },
      });
      if (error) {
        toast.error(error.message || "Could not complete registration.", {
          id: loadingToast,
        });
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        id: loadingToast,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] px-6 py-20 overflow-hidden">
      <div className="absolute -top-40 -right-40 h-125 w-125 rounded-full bg-[#c8f542]/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-125 w-125 rounded-full bg-white/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-115 rounded-2xl border border-white/5 bg-black/40 p-8 backdrop-blur-xl sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
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
            Create Account
          </h2>
          <p className="text-xs text-white/50 tracking-wide">
            Join KAIRO today to access exclusive benefits
          </p>
        </div>

        <form onSubmit={handleEmailSignUp} className="space-y-5">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-[#c8f542]/50 focus:bg-white/8 focus:outline-none"
            />
          </div>

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
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                placeholder="Minimum 8 chars, 1 caps, 1 digit"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                className={`w-full rounded-xl border bg-white/5 pl-4 pr-12 py-3.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:bg-white/8 focus:outline-none ${
                  passwordError
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-[#c8f542]/50"
                }`}
              />
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

            {passwordError && (
              <p className="mt-2 text-xs font-medium text-red-500 tracking-wide">
                {passwordError}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input
              id="terms"
              type="checkbox"
              required
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 rounded border-white/10 bg-white/5 text-[#c8f542] accent-[#c8f542]"
            />
            <label
              htmlFor="terms"
              className="text-xs text-white/50 leading-tight pt-1"
            >
              I agree to the{" "}
              <Link href="#" className="text-white hover:text-[#c8f542]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-white hover:text-[#c8f542]">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 cursor-pointer rounded-xl bg-[#c8f542] py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0a0a0a] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/40 tracking-wide">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-white transition-colors hover:text-[#c8f542]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
