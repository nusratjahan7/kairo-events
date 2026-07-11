"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { SlCalender } from "react-icons/sl";
import { FaLocationDot } from "react-icons/fa6";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

interface EventDetailsProps {
  event: {
    _id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    category: string;
    dateTime: string;
    city: string;
    venue: string;
    price: number;
    imageUrl?: string;
  };
}

const EventDetailsClient = ({ event }: EventDetailsProps) => {
  const [bookingLoading, setBookingLoading] = useState(false);
  const defaultImage =
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7";

  const handleBooking = async () => {
    setBookingLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event._id,
            title: event.title,
            price: event.price,
            imageUrl: event.imageUrl || defaultImage,
          }),
        },
      );

      const session = await response.json();

      if (session.url) {
        window.location.href = session.url;
      } else if (session.id) {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await (stripe as any).redirectToCheckout({
            sessionId: session.id,
          });
          if (error) console.error(error.message);
        }
      } else {
        toast.error("Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error("Something went wrong with the booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Grid Layout: Image Left, Info Right */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Image & Description */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/5 bg-white/5 shadow-2xl">
              <Image
                height={100}
                width={100}
                src={event.imageUrl || defaultImage}
                alt={event.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-6 left-6 rounded-full bg-[#0a0a0a]/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#c8f542] border border-white/5">
                {event.category}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-4">
                About the Event
              </h2>
              <p className="text-sm leading-relaxed text-white/60 whitespace-pre-line">
                {event.shortDescription}
              </p>
              <p className="text-sm leading-relaxed text-white/60 whitespace-pre-line pt-5">
                {event.fullDescription}
              </p>
            </div>
          </div>

          {/* Right Column: Ticket Card & Meta Details */}
          <div className="lg:col-span-5">
            <div className="sticky top-36 rounded-3xl border border-white/10 bg-[#0e0e0e] p-8 shadow-xl">
              {/* Event Title */}
              <h1 className="text-2xl font-black uppercase tracking-tight text-white line-clamp-2">
                {event.title}
              </h1>

              <hr className="my-6 border-white/5" />

              {/* Event Specs */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#c8f542]">
                    <SlCalender />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/40 pb-1">
                      Date & Time
                    </p>
                    <p className="text-xs font-semibold">
                      {new Date(event.dateTime).toLocaleString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#c8f542]">
                    <FaLocationDot />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/40 pb-1">
                      Venue & City
                    </p>
                    <p className="text-xs font-semibold">
                      {event.venue}, {event.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="rounded-2xl bg-white/5 border border-white/5 p-5 mb-6 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-white/40">
                    Ticket Price
                  </span>
                  <span className="text-2xl font-black text-[#c8f542]">
                    {event.price === 0 ? "FREE" : `$${event.price}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-white/40">
                    Availability
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    Available
                  </span>
                </div>
              </div>

              {/* Book Ticket Button */}
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full rounded-full bg-[#c8f542] py-4 text-center text-xs font-black uppercase tracking-widest text-[#0a0a0a] shadow-lg shadow-[#c8f542]/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-[#c8f542]/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {bookingLoading ? "Processing Booking..." : "Book Passage Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsClient;
