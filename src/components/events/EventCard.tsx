"use client";

import Link from "next/link";
import Image from "next/image";
import { EventType } from "./types";

interface CardProps {
  event: EventType;
}

const EventCard = ({ event }: CardProps) => {
  const defaultImage =
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7";

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/5 bg-[#0e0e0e] transition-all duration-300 hover:border-white/10 hover:shadow-xl">
      {/* Event Image */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-white/5">
        <Image
          height={100}
          width={100}
          src={event.imageUrl || defaultImage}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Badge */}
        <span className="absolute top-4 left-4 rounded-full bg-[#0a0a0a]/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#c8f542] border border-white/5">
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date & Location */}
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-3">
          <span>
            {new Date(event.dateTime).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>• {event.city}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[#c8f542] transition-colors">
          {event.title}
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-xs text-white/50 line-clamp-2 min-h-[2rem]">
          {event.shortDescription}
        </p>

        {/* Footer: Price & View Button */}
        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-white/30">
              Ticket Price
            </span>
            <span className="text-sm font-extrabold text-[#c8f542]">
              {event.price === 0 ? "FREE" : `$${event.price}`}
            </span>
          </div>

          <Link
            href={`/events/${event._id}`}
            className="rounded-full bg-white/5 border border-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-[#c8f542] hover:text-[#0a0a0a] hover:border-transparent transition-all duration-200"
          >
            Get Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
