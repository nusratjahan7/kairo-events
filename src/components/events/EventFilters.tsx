"use client";

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

const EventFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}: FiltersProps) => {
  return (
    <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1  w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, city, or venue..."
          className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#c8f542]/50"
        />
      </div>

      {/* Dropdowns Container */}
      <div className="flex flex-wrap gap-3 w-full sm:w-auto">
        {/* Category Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none rounded-full border border-white/10 bg-white/5 px-6 py-3 pr-10 text-xs font-semibold uppercase tracking-wider text-white/80 outline-none transition-all duration-200 cursor-pointer focus:border-[#c8f542]/50 focus:text-white"
          >
            <option
              value=""
              style={{ backgroundColor: "#0e0e0e", color: "#fff" }}
            >
              All Categories
            </option>
            <option
              value="music"
              style={{ backgroundColor: "#0e0e0e", color: "#fff" }}
            >
              Music
            </option>
            <option
              value="tech"
              style={{ backgroundColor: "#0e0e0e", color: "#fff" }}
            >
              Tech
            </option>
            <option
              value="arts"
              style={{ backgroundColor: "#0e0e0e", color: "#fff" }}
            >
              Arts
            </option>
            <option
              value="sports"
              style={{ backgroundColor: "#0e0e0e", color: "#fff" }}
            >
              Sports
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* 💡 🆕 Date Sort Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none rounded-full border border-white/10 bg-white/5 px-6 py-3 pr-10 text-xs font-semibold uppercase tracking-wider text-white/80 outline-none transition-all duration-200 cursor-pointer focus:border-[#c8f542]/50 focus:text-white"
          >
            <option
              value="soonest"
              style={{ backgroundColor: "#0e0e0e", color: "#fff" }}
            >
              Soonest
            </option>
            <option
              value="latest"
              style={{ backgroundColor: "#0e0e0e", color: "#fff" }}
            >
              Latest
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
