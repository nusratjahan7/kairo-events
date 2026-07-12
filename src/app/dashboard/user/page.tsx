"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  User as UserIcon,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  Camera,
  BadgeCheck,
  ShieldCheck,
  Mail,
  CalendarDays,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

const MAX_IMAGE_SIZE_BYTES = 500 * 1024;

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 🆕 session লোড হলে ফর্ম fields প্রি-ফিল
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImagePreview(session.user.image || null);
    }
  }, [session?.user]);

  const showToast = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select a valid image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      showToast("error", "Image must be smaller than 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      showToast("error", "Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("error", "Name can't be empty.");
      return;
    }

    try {
      setSaving(true);
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: imagePreview || undefined,
      });

      if (error) {
        showToast("error", error.message || "Failed to update profile.");
        return;
      }

      await refetch();
      showToast("success", "Profile updated successfully.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-[#c8f542]" size={32} />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-neutral-400 text-sm font-semibold">
        Please log in to view your profile.
      </div>
    );
  }

  const user = session.user;
  const hasChanges =
    name.trim() !== (user.name || "") || imagePreview !== (user.image || null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 p-6">
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[100] space-y-2 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-2 fade-in duration-200 ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/20"
                : "bg-rose-950/90 border-rose-500/20"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2
                size={18}
                className="text-emerald-400 shrink-0 mt-0.5"
              />
            ) : (
              <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm font-semibold flex-1 ${
                toast.type === "success" ? "text-emerald-100" : "text-rose-100"
              }`}
            >
              {toast.message}
            </p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            My Profile
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            Manage your personal information and photo.
          </p>
        </div>

        <div className="border border-neutral-800 rounded-3xl bg-neutral-900/20 shadow-xl p-6 sm:p-8 space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              {imagePreview ? (
                <img
                  src={user.image || undefined}
                  alt={user.name}
                  className="w-30 h-30 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center text-2xl font-bold text-neutral-400 border-2 border-neutral-800">
                  {name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#c8f542] hover:bg-[#b0d839] rounded-full flex items-center justify-center text-black transition-all cursor-pointer shadow-lg"
                title="Change photo"
              >
                <Camera size={14} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-[#c8f542] hover:underline cursor-pointer"
            >
              Change photo
            </button>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 focus:bg-neutral-900 transition-all"
              />
            </div>
          </div>

          {/* Read-only Info */}
          <div className="space-y-3 pt-4 border-t border-neutral-800/60">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-neutral-500 font-semibold">
                <Mail size={14} /> Email
              </span>
              <span className="flex items-center gap-2 font-bold text-neutral-300">
                {user.email}
                {user.emailVerified ? (
                  <span className="text-emerald-400 text-xs font-bold">
                    Verified
                  </span>
                ) : (
                  <span className="text-amber-400 text-xs font-bold">
                    Unverified
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-neutral-500 font-semibold">
                <ShieldCheck size={14} /> Role
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  (user as any).role === "admin"
                    ? "bg-[#c8f542]/10 text-[#c8f542] border-[#c8f542]/20"
                    : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                }`}
              >
                {(user as any).role === "admin" ? (
                  <BadgeCheck size={12} />
                ) : (
                  <UserIcon size={12} />
                )}
                {(user as any).role === "admin" ? "Admin" : "User"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-neutral-500 font-semibold">
                <CalendarDays size={14} /> Joined
              </span>
              <span className="font-bold text-neutral-300">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="w-full bg-[#c8f542] hover:bg-[#b0d839] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
