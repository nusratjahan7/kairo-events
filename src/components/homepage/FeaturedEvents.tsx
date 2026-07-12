"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getEvents } from "@/lib/api/events";
import EventCard from "../events/EventCard";

interface MongoDBDate {
  $date: string;
}

interface Event {
  _id: {
    $oid: string;
  };
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  dateTime: MongoDBDate;
  city: string;
  venue: string;
  price: number;
  capacity: number;
  imageUrl: string;
  userId: string;
  createdAt: MongoDBDate;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1.0],
    },
  },
};

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents();
        if (data && Array.isArray(data)) {
          setEvents(data.slice(0, 4));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load featured events");
      } finally {
        setLoading(false);
      }
    };
    fetchLatestEvents();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center bg-[#0a0a0a] rounded-3xl border border-neutral-900">
        <Loader2 className="animate-spin text-[#c8f542] mb-3" size={32} />
        <p className="text-sm font-semibold text-neutral-400">
          Loading latest events...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center bg-[#0a0a0a] rounded-3xl border border-rose-950/30 p-6 text-center">
        <p className="text-sm font-bold text-rose-400">Error: {error}</p>
        <p className="text-xs text-neutral-500 mt-1">
          Please check your endpoint or schema.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-[#0a0a0a] text-white py-16 px-4 max-w-7xl mx-auto space-y-10">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: "easeOut",
        }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-900 pb-6"
      >
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#c8f542]">
            Don't Miss Out
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white mt-1">
            Featured Events
          </h2>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center justify-center px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white hover:text-[#c8f542] border border-neutral-800 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg cursor-pointer"
        >
          View All Events
        </Link>
      </motion.div>

      {/* Events Container */}
      {events.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 font-semibold border border-neutral-900 rounded-3xl">
          No live events available right now.
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {events.map((event, index) => {
            const eventKey = event._id?.$oid || `featured-event-${index}`;

            return (
              <motion.div
                key={eventKey}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <EventCard event={event} />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}
