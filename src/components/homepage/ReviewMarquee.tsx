"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
}

// 📌 ডামি রিভিউ ডেটা (আপনার প্রয়োজন অনুযায়ী পরিবর্তন করতে পারেন)
const mockReviews: Review[] = [
  {
    id: "1",
    name: "Anik Rahman",
    role: "Event Enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    comment:
      "The Neon Music Festival was wild! Best ticketing experience ever.",
    rating: 5,
  },
  {
    id: "2",
    name: "Nabila Islam",
    role: "Concert Goer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    comment: "Super smooth check-in at ICCB. Totally worth the price!",
    rating: 5,
  },
  {
    id: "3",
    name: "Tanvir Ahmed",
    role: "Tech Lead",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    comment:
      "Loved the UI/UX of this platform. Booking took less than 60 seconds.",
    rating: 5,
  },
  {
    id: "4",
    name: "Sara Khan",
    role: "Music Lover",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
    comment:
      "Highly recommended if you don't want to miss major cultural events in Dhaka.",
    rating: 4,
  },
  {
    id: "5",
    name: "Zayan Malik",
    role: "DJ & Producer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    comment:
      "Brilliant execution. The organizer updates were instantly sent to my mail.",
    rating: 5,
  },
  {
    id: "6",
    name: "Riya Sen",
    role: "Art Director",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    comment: "Stunning visual presentations for each event page. Pure class.",
    rating: 5,
  },
];

const firstRow = [...mockReviews, ...mockReviews];
const secondRow = [...mockReviews.reverse(), ...mockReviews];

export default function ReviewMarquee() {
  return (
    <section className="bg-[#0a0a0a] text-white py-20 overflow-hidden relative w-full">
      <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-14 text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-[#c8f542]">
          Community Voice
        </span>
        <h2 className="text-3xl font-black tracking-tight text-white">
          What People Are Saying
        </h2>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          Hear from the thousands of attendees who built unforgettable memories
          with us.
        </p>
      </div>

      {/* Marquee Wrapper */}
      <div className="flex flex-col gap-6 w-full max-w-[1920px] mx-auto">
        <div className="flex w-max gap-6">
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
            className="flex gap-6 shrink-0"
          >
            {firstRow.map((review, idx) => (
              <ReviewCard key={`row1-${review.id}-${idx}`} review={review} />
            ))}
          </motion.div>
        </div>

        <div className="flex w-max gap-6">
          <motion.div
            animate={{ x: ["-50%", 0] }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
            className="flex gap-6 shrink-0"
          >
            {secondRow.map((review, idx) => (
              <ReviewCard key={`row2-${review.id}-${idx}`} review={review} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="w-[320px] sm:w-[360px] p-6 bg-neutral-950 border border-neutral-900 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:border-neutral-800 transition-colors group relative overflow-hidden">
      <Quote className="absolute right-4 bottom-4 text-neutral-900/40 w-16 h-16 pointer-events-none -z-0" />

      <div className="space-y-3 z-10">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < review.rating
                  ? "text-[#c8f542] fill-[#c8f542]"
                  : "text-neutral-700"
              }
            />
          ))}
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed line-clamp-3">
          "{review.comment}"
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-neutral-900/60 z-10">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-9 h-9 rounded-full object-cover border border-neutral-800 group-hover:border-neutral-700 transition-colors"
        />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors">
            {review.name}
          </span>
          <span className="text-[10px] font-medium text-neutral-500">
            {review.role}
          </span>
        </div>
      </div>
    </div>
  );
}
