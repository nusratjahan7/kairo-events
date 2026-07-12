"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  Loader2,
  X,
  Trash2,
} from "lucide-react";
import { getBookings } from "@/lib/api/bookings";
import { deleteBooking, updateBookingStatus } from "@/lib/actions/bookings";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  eventName: string;
  eventDate: string;
  ticketsCount: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  bookedAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mutationLoading, setMutationLoading] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookingsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBookings();
      setBookings(res || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsData();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "confirmed" | "cancelled",
  ) => {
    try {
      setMutationLoading(true);
      await updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );
      setSelectedBooking(null);
    } catch (err: any) {
      alert(err.message || "Failed to update booking status");
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking?"))
      return;

    try {
      setMutationLoading(true);
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setSelectedBooking(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete booking");
    } finally {
      setMutationLoading(false);
    }
  };

  const exportToCSV = () => {
    if (bookings.length === 0) return;

    const headers = [
      "Booking ID",
      "Customer Name",
      "Email",
      "Event Name",
      "Event Date",
      "Tickets",
      "Total Price",
      "Status",
    ];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.customerName}"`,
      b.customerEmail,
      `"${b.eventName}"`,
      b.eventDate,
      b.ticketsCount,
      b.totalPrice,
      b.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `bookings_report_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const totalSales = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const totalTickets = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.ticketsCount, 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-6 min-h-screen bg-[#0a0a0a] text-slate-100 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Manage Bookings
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            Monitor and process all event ticket transactions.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          disabled={loading || bookings.length === 0}
          className="inline-flex items-center gap-2 bg-[#c8f542] hover:bg-[#b0d839] disabled:opacity-50 disabled:hover:bg-[#c8f542] text-black font-bold text-sm px-4 py-2.5 rounded-2xl transition-all shadow-sm cursor-pointer select-none"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 border border-neutral-800 bg-neutral-900/40 rounded-2xl">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Total Sales
          </p>
          <p className="text-2xl font-black text-white mt-1">
            ${loading ? "..." : totalSales.toLocaleString()}
          </p>
        </div>
        <div className="p-5 border border-neutral-800 bg-neutral-900/40 rounded-2xl">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Active Tickets
          </p>
          <p className="text-2xl font-black text-white mt-1">
            {loading ? "..." : `${totalTickets} Tickets`}
          </p>
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 border border-neutral-800 rounded-3xl bg-neutral-900/20">
          <Loader2 className="animate-spin text-[#c8f542] mb-3" size={32} />
          <p className="text-sm font-semibold text-neutral-400">
            Loading bookings data...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 border border-rose-900/30 rounded-3xl bg-rose-950/10 text-center p-6">
          <p className="text-sm font-bold text-rose-400">Error: {error}</p>
          <button
            onClick={fetchBookingsData}
            className="mt-3 text-xs font-bold text-[#c8f542] underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="border border-neutral-800 rounded-3xl overflow-hidden bg-neutral-900/20 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/60 border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Booking ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Event</th>
                  <th className="py-4 px-6 text-center">Tickets</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-sm font-medium text-neutral-300">
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-sm text-neutral-500 font-semibold"
                    >
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-neutral-900/40 transition-colors group"
                    >
                      <td className="py-4 px-6 font-mono text-xs font-bold text-neutral-500">
                        {booking.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-200 group-hover:text-white transition-colors">
                            {booking.customerName}
                          </span>
                          <span className="text-xs text-neutral-500 font-normal">
                            {booking.customerEmail}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col max-w-[200px]">
                          <span className="font-semibold text-neutral-200 truncate group-hover:text-white transition-colors">
                            {booking.eventName}
                          </span>
                          <span className="text-xs text-neutral-500 font-normal">
                            {booking.eventDate}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-neutral-200">
                        {booking.ticketsCount}
                      </td>
                      <td className="py-4 px-6 font-black text-white">
                        ৳{booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-[#c8f542] transition-colors inline-flex items-center justify-center cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-neutral-800 bg-neutral-900/40 flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>Showing {bookings.length} bookings</span>
          </div>
        </div>
      )}

      {/* Details & Action Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-neutral-800 w-full max-w-md rounded-3xl p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedBooking(null)}
              disabled={mutationLoading}
              className="absolute right-4 top-4 p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-black text-white mb-4">
              Booking Details
            </h2>

            <div className="space-y-4 text-sm mb-6">
              <div className="pb-3 border-b border-neutral-800/60 flex justify-between">
                <span className="text-neutral-500 font-semibold">
                  Booking ID:
                </span>
                <span className="font-mono text-neutral-300 font-bold">
                  {selectedBooking.id}
                </span>
              </div>
              <div className="pb-3 border-b border-neutral-800/60">
                <p className="text-neutral-500 font-semibold mb-1">Customer:</p>
                <p className="font-bold text-white">
                  {selectedBooking.customerName}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {selectedBooking.customerEmail}
                </p>
              </div>
              <div className="pb-3 border-b border-neutral-800/60">
                <p className="text-neutral-500 font-semibold mb-1">Event:</p>
                <p className="font-bold text-white">
                  {selectedBooking.eventName}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Date: {selectedBooking.eventDate}
                </p>
              </div>
              <div className="pb-3 border-b border-neutral-800/60 flex justify-between">
                <span className="text-neutral-500 font-semibold">Tickets:</span>
                <span className="font-bold text-white">
                  {selectedBooking.ticketsCount} Pcs
                </span>
              </div>
              <div className="pb-3 border-b border-neutral-800/60 flex justify-between items-center">
                <span className="text-neutral-500 font-semibold">
                  Total Amount:
                </span>
                <span className="font-black text-[#c8f542] text-base">
                  ৳{selectedBooking.totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-neutral-500 font-semibold">Status:</span>
                {getStatusBadge(selectedBooking.status)}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-800/60">
              {selectedBooking.status === "pending" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={mutationLoading}
                    onClick={() =>
                      handleUpdateStatus(selectedBooking.id, "cancelled")
                    }
                    className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-2.5 rounded-2xl border border-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    {mutationLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <XCircle size={14} />
                    )}
                    Cancel Booking
                  </button>
                  <button
                    disabled={mutationLoading}
                    onClick={() =>
                      handleUpdateStatus(selectedBooking.id, "confirmed")
                    }
                    className="w-full bg-[#c8f542] hover:bg-[#b0d839] text-black font-bold py-2.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    {mutationLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    Approve Order
                  </button>
                </div>
              )}

              <button
                disabled={mutationLoading}
                onClick={() => handleDeleteBooking(selectedBooking.id)}
                className="w-full mt-2 bg-neutral-900 hover:bg-rose-950/20 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-900/50 font-bold py-2.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {mutationLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete Record Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
