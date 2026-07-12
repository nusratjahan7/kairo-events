"use client";

import { authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FaFileDownload } from "react-icons/fa";

interface EventDetails {
  title: string;
  dateTime: string;
  venue: string;
  city: string;
  price: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const session_id = searchParams.get("session_id");
  const eventId = searchParams.get("eventId");

  const { data: session } = authClient.useSession();

  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingSaved, setBookingSaved] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!eventId || eventId === "undefined" || eventId === "null") return;

    if (session === undefined) return;

    if (!BACKEND_URL) {
      console.error(
        "❌ NEXT_PUBLIC_BACKEND_URL is not set. Check .env.local and restart the dev server.",
      );
      setLoading(false);
      return;
    }

    const fetchEventData = async () => {
      try {
        const token = session?.session?.token;

        const res = await fetch(`${BACKEND_URL}/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Event fetch failed with status ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Backend returned non-JSON response — check NEXT_PUBLIC_BACKEND_URL and CORS",
          );
        }

        const result = await res.json();

        if (result.success) {
          setEventDetails(result.data);
        }
      } catch (error) {
        console.error("Error fetching event for ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, session]);

  useEffect(() => {
    if (!eventDetails || !session_id || bookingSaved) return;
    if (session === undefined) return;
    if (!BACKEND_URL) return;

    const saveBookingToDb = async () => {
      try {
        const bookingData = {
          eventId,
          customerName: session?.user?.name || "Guest User",
          customerEmail: session?.user?.email || "unknown@example.com",
          eventName: eventDetails.title,
          eventDate: new Date(eventDetails.dateTime).toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            },
          ),
          ticketsCount: 1,
          totalPrice: eventDetails.price,
          status: "confirmed",
          stripeSessionId: session_id,
        };

        const response = await fetch(`${BACKEND_URL}/api/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.session?.token}`,
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          throw new Error(`Booking save failed with status ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Backend returned non-JSON response while saving booking — check NEXT_PUBLIC_BACKEND_URL",
          );
        }

        const data = await response.json();
        if (data.success) {
          console.log("✅ Booking saved successfully inside MongoDB!");
          setBookingSaved(true);
        } else {
          setBookingError(data.message || "Failed to save booking");
        }
      } catch (error: any) {
        console.error("❌ Failed to auto-save booking data:", error);
        setBookingError(error.message || "Failed to save booking");
      }
    };

    saveBookingToDb();
  }, [eventDetails, session_id, bookingSaved, session]);

  const handleDownloadPDF = () => {
    const printContent = ticketRef.current?.innerHTML;
    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a0a]">
        Loading your ticket...
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a0a]">
        Ticket details not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 font-sans">
      {bookingError && (
        <div className="mb-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl max-w-md text-center">
          Booking record couldn't be saved: {bookingError}. Your payment is
          still successful — please contact support with your Payment ID.
        </div>
      )}

      <div className="flex flex-col md:flex-row md:gap-10 ">
        <div className="bg-[#0e0e0e] p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/5 mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-white/60 mb-6 text-sm">
            Thank you for your purchase. Your ticket is ready for download.
          </p>

          <button
            onClick={handleDownloadPDF}
            className="w-full bg-[#c8f542] hover:bg-[#b0d83b] text-[#0a0a0a] font-black uppercase tracking-widest py-3 px-4 rounded-full transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaFileDownload /> Download Ticket PDF
          </button>
        </div>

        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden text-gray-800"
          ref={ticketRef}
        >
          <div className="bg-linear-to-r from-gray-900 to-black text-white p-6 text-center">
            <span className="text-xs uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full font-semibold text-[#c8f542]">
              Official Entry Pass
            </span>

            <h2 className="text-xl font-bold mt-3 text-white">
              {eventDetails.title}
            </h2>
          </div>

          <div className="p-6 space-y-4 bg-white">
            <div className="text-sm">
              <span className="text-xs text-gray-400 block uppercase font-medium">
                Attendee
              </span>
              <span className="font-semibold text-gray-700">
                {session?.user?.name || "Guest User"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-gray-400 block uppercase font-medium">
                  Date & Time
                </span>

                <span className="font-semibold text-gray-700">
                  {new Date(eventDetails.dateTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block uppercase font-medium">
                  Venue
                </span>

                <span className="font-semibold text-gray-700">
                  {eventDetails.venue}, {eventDetails.city}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 my-4"></div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-gray-400 block uppercase font-medium">
                  Payment ID
                </span>
                <span className="font-mono text-xs text-gray-600 block truncate">
                  {session_id
                    ? String(session_id).substring(0, 15) + "..."
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block uppercase font-medium">
                  Price Paid
                </span>

                <span className="font-bold text-emerald-600 text-base">
                  ${eventDetails.price}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="w-48 h-12 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_8px)] opacity-80"></div>
              <span className="text-[10px] font-mono tracking-widest text-gray-400 mt-2">
                *SECURE-TICKET-{eventId}*
              </span>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 text-center text-xs text-gray-400 border-t border-gray-100">
            Please bring a printed copy or show this digital PDF at the
            entrance.
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-6 text-sm text-white/40 hover:text-white underline cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  );
}
