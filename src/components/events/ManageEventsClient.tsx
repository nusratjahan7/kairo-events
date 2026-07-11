"use client";
import { deleteEvent, updateEvent } from "@/lib/actions/events";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface EventData {
  _id: string;
  title: string;
  venue: string;
  city: string;
  dateTime: string;
  price: number;
  capacity: number;
  imageUrl?: string;
  shortDescription?: string;
}

interface ManageEventsClientProps {
  initialEvents: EventData[];
}

const ManageEventsClient = ({ initialEvents }: ManageEventsClientProps) => {
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  const [isMounted, setIsMounted] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [editEvent, setEditEvent] = useState<EventData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteEvent(deleteId);
      const updatedEvents = events.filter((e) => e._id !== deleteId);
      setEvents(updatedEvents);

      const newTotalPages = Math.ceil(updatedEvents.length / itemsPerPage);
      if (currentPage > newTotalPages && currentPage > 1) {
        setCurrentPage(newTotalPages);
      }

      setDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete event.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editEvent) return;
    setLoading(true);
    try {
      await updateEvent(editEvent._id, editEvent);
      setEvents(events.map((e) => (e._id === editEvent._id ? editEvent : e)));
      setEditEvent(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full bg-[#0e0e0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-xs md:text-sm uppercase tracking-wider text-white/60">
                <th className="p-4">Image</th>
                <th className="p-4">Event Details</th>
                <th className="p-4 hidden md:table-cell">Date & Time</th>
                <th className="p-4 hidden sm:table-cell">Venue</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 relative">
                        <Image
                          height={100}
                          width={100}
                          src={
                            event.imageUrl ||
                            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7"
                          }
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="p-4 max-w-45 md:max-w-none">
                      <p className="font-bold text-white truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-green-400 font-mono sm:hidden mt-1">
                        {event.venue}, {event.city}
                      </p>

                      <p className="text-xs text-white/40 md:hidden mt-0.5">
                        {isMounted
                          ? new Date(event.dateTime).toLocaleDateString()
                          : ""}
                      </p>
                    </td>

                    <td className="p-4 hidden md:table-cell text-white/80">
                      {isMounted ? (
                        <>
                          {new Date(event.dateTime).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}{" "}
                          -{" "}
                          {new Date(event.dateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </>
                      ) : (
                        "Loading date..."
                      )}
                    </td>

                    <td className="p-4 hidden sm:table-cell text-white/60">
                      {event.venue}, {event.city}
                    </td>

                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setEditEvent(event)}
                        className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(event._id)}
                        className="bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white/[0.02] border-t border-white/5 px-4 py-4 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="relative inline-flex items-center px-4 py-2 border border-white/10 text-xs font-medium rounded-xl text-white bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-white/10 text-xs font-medium rounded-xl text-white bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer"
              >
                Next
              </button>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/60">
                  Showing{" "}
                  <span className="font-medium text-white">
                    {indexOfFirstItem + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-white">
                    {indexOfLastItem > events.length
                      ? events.length
                      : indexOfLastItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-white">
                    {events.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px gap-1.5"
                  aria-label="Pagination"
                >
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="relative inline-flex items-center px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer"
                  >
                    <IoIosArrowBack />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-3.5 py-2 rounded-xl border text-sm font-medium transition cursor-pointer ${
                        currentPage === index + 1
                          ? "bg-[#c8f542] border-[#c8f542] text-[#0a0a0a] font-bold shadow-md"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="relative inline-flex items-center px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer"
                  >
                    <IoIosArrowForward />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📝 ১. EDIT MODAL */}
      {editEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4 text-[#c8f542]">
              Edit Event Details
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
              <div>
                <label className="text-white/60 block mb-1">Event Title</label>
                <input
                  type="text"
                  value={editEvent.title}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, title: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c8f542]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 block mb-1">Venue</label>
                  <input
                    type="text"
                    value={editEvent.venue}
                    onChange={(e) =>
                      setEditEvent({ ...editEvent, venue: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c8f542]"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 block mb-1">City</label>
                  <input
                    type="text"
                    value={editEvent.city}
                    onChange={(e) =>
                      setEditEvent({ ...editEvent, city: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c8f542]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-white/60 block mb-1">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  value={new Date(editEvent.dateTime)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, dateTime: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c8f542]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={editEvent.price}
                    onChange={(e) =>
                      setEditEvent({
                        ...editEvent,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c8f542]"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 block mb-1">Capacity</label>
                  <input
                    type="number"
                    value={editEvent.capacity}
                    onChange={(e) =>
                      setEditEvent({
                        ...editEvent,
                        capacity: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c8f542]"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditEvent(null)}
                  className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#c8f542] hover:bg-[#b0d83b] text-[#0a0a0a] font-bold px-5 py-2 rounded-xl transition disabled:opacity-55 cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ⚠️ ২. CONFIRMATION MODAL (DELETE) */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Event?</h3>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
              >
                No, Keep it
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-55 cursor-pointer"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageEventsClient;
