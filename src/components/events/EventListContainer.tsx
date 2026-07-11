"use client";

import { useEffect, useState } from "react";
import { EventType } from "./types";
import EventFilters from "./EventFilters";
import EventCard from "./EventCard";

interface ContainerProps {
  initialEvents: EventType[];
}

const ITEMS_PER_PAGE = 6;

const EventListContainer = ({ initialEvents }: ContainerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("soonest");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const filteredEvents = initialEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.dateTime).getTime();
    const dateB = new Date(b.dateTime).getTime();
    return sortBy === "soonest" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = sortedEvents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <>
      {/* Filters */}
      <EventFilters
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        sortBy={sortBy}
        setSortBy={handleSortChange}
      />

      {/* Events Grid */}
      {paginatedEvents.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0e0e0e] p-20 text-center">
          <p className="text-sm text-white/40 uppercase tracking-widest">
            No events found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* 💡 🆕 pagination UI Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/60 transition-all hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-20 cursor-pointer"
              >
                <svg
                  className="h-4 w-4 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-10 w-10 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNumber
                        ? "bg-[#c8f542] text-[#0a0a0a]"
                        : "border border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/60 transition-all hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-20 cursor-pointer"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default EventListContainer;
