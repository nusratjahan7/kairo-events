"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { serverMutation } from "@/lib/core/server";
import { authClient } from "@/lib/auth-client";

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    dateTime: "",
    city: "",
    venue: "",
    price: "",
    capacity: "",
    imageUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = session?.user?.id;

    setLoading(true);
    const toastId = toast.loading("Creating your event...");

    try {
      const payload = {
        ...formData,
        userId: userId,
      };

      await serverMutation("/events", payload, "POST");

      toast.success("Event created successfully!", { id: toastId });
      router.push("/events");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create event. Try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/5 bg-[#0e0e0e] p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-white">
            Create New Event
          </h1>
          <p className="text-xs text-white/40 mt-2">
            Fill in the details below to publish a premium experience.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
              Event Title <span className="text-[#c8f542]">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Kairo Neon Music Festival"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#c8f542]/50"
            />
          </div>

          {/* Short Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
              Short Description <span className="text-[#c8f542]">*</span>
            </label>
            <input
              type="text"
              name="shortDescription"
              required
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="A one-line punchy catchphrase for the event cards"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#c8f542]/50"
            />
          </div>

          {/* Full Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
              Full Description <span className="text-[#c8f542]">*</span>
            </label>
            <textarea
              name="fullDescription"
              required
              rows={5}
              value={formData.fullDescription}
              onChange={handleChange}
              placeholder="Detailed schedule, performer lists, guidelines, and what to expect..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#c8f542]/50 resize-none"
            />
          </div>

          {/* Grid Area 1: Category & Date/Time */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                Category <span className="text-[#c8f542]">*</span>
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-[#0e0e0e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c8f542]/50 cursor-pointer"
              >
                <option
                  value=""
                  disabled
                  className="bg-[#0e0e0e] text-white/40"
                >
                  Select Category
                </option>
                <option value="music" className="bg-[#0e0e0e] text-white">
                  Music & Concerts
                </option>
                <option value="tech" className="bg-[#0e0e0e] text-white">
                  Tech & Conferences
                </option>
                <option value="arts" className="bg-[#0e0e0e] text-white">
                  Arts & Theatre
                </option>
                <option value="sports" className="bg-[#0e0e0e] text-white">
                  Sports & Fitness
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                Date & Time <span className="text-[#c8f542]">*</span>
              </label>
              <input
                type="datetime-local"
                name="dateTime"
                required
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c8f542]/50 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Grid Area 2: City & Venue */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                City <span className="text-[#c8f542]">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Dhaka"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#c8f542]/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                Venue <span className="text-[#c8f542]">*</span>
              </label>
              <input
                type="text"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g., ICCB Hall 4"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#c8f542]/50"
              />
            </div>
          </div>

          {/* Grid Area 3: Price & Capacity */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                Price (USD) <span className="text-[#c8f542]">*</span>
              </label>
              <input
                type="number"
                name="price"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="0 for Free entry"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#c8f542]/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                Capacity <span className="text-[#c8f542]">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                min="1"
                required
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Available tickets count"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#c8f542]/50"
              />
            </div>
          </div>

          {/* Image URL (Optional) */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
              Image URL <span className="text-white/30">(Optional)</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/banner.jpg"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#c8f542]/50"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 border-t border-white/5 pt-6 mt-8">
            <button
              type="button"
              disabled={loading}
              onClick={() => router.back()}
              className="rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#c8f542] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#0a0a0a] hover:bg-[#add435] transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 cursor-pointer"
            >
              {loading ? "Publishing..." : "Publish Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
