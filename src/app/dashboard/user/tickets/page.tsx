"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Ticket,
  Loader2,
  Download,
  CalendarDays,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getMyBookings } from "@/lib/api/bookings";

interface Booking {
  id: string;
  eventId?: string;
  customerName: string;
  customerEmail: string;
  eventName: string;
  eventDate: string;
  ticketsCount: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  bookedAt: string;
  stripeSessionId?: string;
}

interface EventInfo {
  venue?: string;
  city?: string;
}

interface ToastMsg {
  id: number;
  type: "success" | "error";
  message: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MyTicketsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventInfoMap, setEventInfoMap] = useState<Record<string, EventInfo>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const showToast = useCallback((type: ToastMsg["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (isPending) return;
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await getMyBookings(session.user.email);
        setBookings(list);

        const uniqueEventIds = [
          ...new Set(list.map((b) => b.eventId).filter(Boolean)),
        ] as string[];

        if (uniqueEventIds.length > 0 && BACKEND_URL) {
          const results = await Promise.all(
            uniqueEventIds.map(async (id) => {
              try {
                const r = await fetch(`${BACKEND_URL}/events/${id}`);
                const data = await r.json();
                return data.success
                  ? [id, { venue: data.data.venue, city: data.data.city }]
                  : [id, {}];
              } catch {
                return [id, {}];
              }
            }),
          );
          setEventInfoMap(Object.fromEntries(results));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load your tickets");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session?.user?.email, isPending]);

  const getStatusBadge = (status: Booking["status"]) => {
    const config = {
      confirmed: {
        bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
        text: "Confirmed",
      },
      pending: {
        bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        icon: Clock,
        text: "Pending",
      },
      cancelled: {
        bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        icon: XCircle,
        text: "Cancelled",
      },
    };
    const current = config[status];
    const StatusIcon = current.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.bg}`}
      >
        <StatusIcon size={12} />
        {current.text}
      </span>
    );
  };

  // 🆕 নতুন উইন্ডোতে টিকিট রেন্ডার করে print — মূল পেজ অক্ষত থাকে
  const handleDownload = (booking: Booking) => {
    if (booking.status === "cancelled") {
      showToast("error", "Cancelled tickets can't be downloaded.");
      return;
    }

    setDownloadingId(booking.id);

    const info = booking.eventId ? eventInfoMap[booking.eventId] : undefined;
    const venueLine = info?.venue
      ? `${info.venue}${info.city ? `, ${info.city}` : ""}`
      : "Venue details unavailable";

    const win = window.open("", "_blank", "width=500,height=700");
    if (!win) {
      showToast("error", "Please allow pop-ups to download your ticket.");
      setDownloadingId(null);
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>Ticket - ${booking.eventName}</title>
          <style>
            body { font-family: -apple-system, Arial, sans-serif; margin: 0; padding: 24px; background: #f3f4f6; }
            .card { max-width: 420px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(to right, #111827, #000); color: #fff; padding: 24px; text-align: center; }
            .badge { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 999px; color: #c8f542; font-weight: 600; }
            .title { font-size: 20px; font-weight: 700; margin-top: 12px; }
            .body { padding: 24px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 14px; }
            .label { color: #9ca3af; text-transform: uppercase; font-size: 11px; font-weight: 600; display: block; margin-bottom: 2px; }
            .value { color: #374151; font-weight: 600; }
            .divider { border-top: 1px dashed #e5e7eb; margin: 16px 0; }
            .footer { background: #f9fafb; padding: 12px 24px; text-align: center; font-size: 11px; color: #9ca3af; }
            .price { color: #059669; font-weight: 700; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">Official Entry Pass</span>
              <div class="title">${booking.eventName}</div>
            </div>
            <div class="body">
              <div class="row">
                <div><span class="label">Attendee</span><span class="value">${booking.customerName}</span></div>
              </div>
              <div class="row">
                <div><span class="label">Date</span><span class="value">${booking.eventDate}</span></div>
                <div><span class="label">Venue</span><span class="value">${venueLine}</span></div>
              </div>
              <div class="divider"></div>
              <div class="row">
                <div><span class="label">Booking ID</span><span class="value" style="font-family:monospace;font-size:11px">${booking.id}</span></div>
                <div><span class="label">Tickets</span><span class="value">${booking.ticketsCount} Pcs</span></div>
              </div>
              <div class="row">
                <div><span class="label">Total Paid</span><span class="price">৳${booking.totalPrice.toLocaleString()}</span></div>
              </div>
            </div>
            <div class="footer">Please bring a printed copy or show this digital PDF at the entrance.</div>
          </div>
        </body>
      </html>
    `);
    win.document.close();

    win.onload = () => {
      win.focus();
      win.print();
    };

    setDownloadingId(null);
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-[#c8f542]" size={32} />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-neutral-400 text-sm font-semibold">
        Please log in to view your tickets.
      </div>
    );
  }

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
              className={`text-sm font-semibold flex-1 ${toast.type === "success" ? "text-emerald-100" : "text-rose-100"}`}
            >
              {toast.message}
            </p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            My Tickets
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            View and download tickets for events you've booked.
          </p>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-16 border border-rose-900/30 rounded-3xl bg-rose-950/10 text-center p-6">
            <p className="text-sm font-bold text-rose-400">Error: {error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-neutral-800 rounded-3xl bg-neutral-900/20 text-center">
            <Ticket className="text-neutral-600 mb-3" size={32} />
            <p className="text-sm font-semibold text-neutral-400">
              You haven't booked any events yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookings.map((booking) => {
              const info = booking.eventId
                ? eventInfoMap[booking.eventId]
                : undefined;
              return (
                <div
                  key={booking.id}
                  className="border border-neutral-800 rounded-3xl bg-neutral-900/20 p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white leading-tight">
                        {booking.eventName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mt-1">
                        <CalendarDays size={12} />
                        {booking.eventDate}
                      </div>
                      {info?.venue && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mt-0.5">
                          <MapPin size={12} />
                          {info.venue}
                          {info.city ? `, ${info.city}` : ""}
                        </div>
                      )}
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="flex items-center justify-between text-sm border-t border-neutral-800/60 pt-3">
                    <div>
                      <span className="text-xs text-neutral-500 font-semibold block">
                        Tickets
                      </span>
                      <span className="font-bold text-neutral-200">
                        {booking.ticketsCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 font-semibold block">
                        Total Paid
                      </span>
                      <span className="font-black text-[#c8f542]">
                        ৳{booking.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(booking)}
                      disabled={
                        downloadingId === booking.id ||
                        booking.status === "cancelled"
                      }
                      className="inline-flex items-center gap-2 bg-[#c8f542] hover:bg-[#b0d839] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs px-4 py-2.5 rounded-2xl transition-all cursor-pointer"
                    >
                      {downloadingId === booking.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
