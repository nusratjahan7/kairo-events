"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Clock, Calendar, Radio, Disc } from "lucide-react";
import { BsYoutube } from "react-icons/bs";

interface Episode {
  id: string;
  episodeNumber: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: "Music Production" | "Sound Engineering" | "Artist Stories";
  imageUrl: string;
  youtubeUrl: string;
}

const musicEpisodes: Episode[] = [
  {
    id: "m1",
    episodeNumber: "EP 10",
    title: "The Science of Sound: Mixing for Mega Festivals",
    description:
      "An inside look into tuning line-arrays, balancing low-end bass in open-air mud fields, and managing ICCB stadium-level acoustic reflections.",
    duration: "58 mins",
    date: "July 11, 2026",
    category: "Sound Engineering",
    imageUrl:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "m2",
    episodeNumber: "EP 12",
    title: "Synthesizers & Cyberpunk: Creating Neon Soundscapes",
    description:
      "How modern electronic artists blend analog classic synths with software presets to create high-octane background scores for digital art.",
    duration: "42 mins",
    date: "July 05, 2026",
    category: "Music Production",
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "m3",
    episodeNumber: "EP 13",
    title: "From Underground Beats to Mainstage Festivals",
    description:
      "An intimate conversation with electronic music producers on surviving the independent music industry, streaming royalties, and booking live tours.",
    duration: "50 mins",
    date: "June 28, 2026",
    category: "Artist Stories",
    imageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "m4",
    episodeNumber: "EP 22",
    title: "Psychoacoustics & 3D Spatial Audio Systems",
    description:
      "Understanding how the human brain perceives depth and space in audio. Practical tricks to design immersive Binaural mixes and Dolby Atmos tracks for games and modern streaming software.",
    duration: "49 mins",
    date: "June 18, 2026",
    category: "Sound Engineering",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

const subCategories = [
  "All",
  "Music Production",
  "Sound Engineering",
  "Artist Stories",
];

export default function MusicEpisodesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEpisodes = musicEpisodes.filter((ep) => {
    const matchesSearch =
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || ep.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen py-20 px-4 selection:bg-[#c8f542] selection:text-black">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ─── HEADER SECTION ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-900 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-950 border border-neutral-900 rounded-full text-xs font-black tracking-widest text-[#c8f542] uppercase">
              <Radio size={12} className="animate-pulse" /> Audio & Sound
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              Music <span className="text-[#c8f542]">Episodes</span>
            </h1>
            <p className="text-sm text-neutral-400 max-w-md">
              Diving deep into synthesis, acoustics, and raw electronic music
              culture.
            </p>
          </div>

          {/* 🔍 SEARCH */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-3.5 text-neutral-500"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search music sessions..."
              className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-900 rounded-xl text-sm font-semibold text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 transition-all"
            />
          </div>
        </div>

        {/* ─── MUSIC SUB-CATEGORIES ─── */}
        <div className="flex flex-wrap gap-2">
          {subCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#c8f542] text-black border-[#c8f542]"
                  : "bg-neutral-950 text-neutral-400 border-neutral-900 hover:border-neutral-800 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ─── MUSIC GRID LIST ─── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEpisodes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-20 text-neutral-500 font-bold border border-neutral-900 border-dashed rounded-3xl"
              >
                No audio episodes found in this sub-genre.
              </motion.div>
            ) : (
              filteredEpisodes.map((episode) => (
                <motion.div
                  layout
                  key={episode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden hover:border-neutral-800 transition-all flex flex-col sm:flex-row shadow-2xl h-full"
                >
                  {/* Music Cover Image & Hover Effect */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-neutral-900 overflow-hidden shrink-0">
                    <img
                      src={episode.imageUrl}
                      alt={episode.title}
                      className="object-cover w-full h-full opacity-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-800 text-[10px] font-black tracking-wider text-white uppercase flex items-center gap-1">
                      <Disc
                        size={10}
                        className="animate-spin"
                        style={{ animationDuration: "4s" }}
                      />{" "}
                      {episode.episodeNumber}
                    </div>

                    <a
                      href={episode.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="p-3 bg-rose-600 text-white rounded-full scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                        <BsYoutube size={20} fill="currentColor" />
                      </div>
                    </a>
                  </div>

                  {/* Details Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black tracking-widest text-[#c8f542] uppercase bg-[#c8f542]/5 border border-[#c8f542]/10 px-2 py-0.5 rounded">
                        {episode.category}
                      </span>
                      <h2 className="text-lg font-black text-neutral-100 group-hover:text-white transition-colors line-clamp-1 pt-1">
                        {episode.title}
                      </h2>
                      <p className="text-xs text-neutral-400 font-medium leading-relaxed line-clamp-2">
                        {episode.description}
                      </p>
                    </div>

                    {/* Audio Metadata */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-900/60">
                      <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          <span>{episode.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          <span>{episode.date}</span>
                        </div>
                      </div>

                      {/* Watch on YouTube Link Trigger Button */}
                      <a
                        href={episode.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-900 group-hover:bg-[#c8f542] text-neutral-400 group-hover:text-black rounded-xl text-xs font-black transition-all duration-300 shadow-md cursor-pointer"
                      >
                        <Play size={10} className="fill-current" />
                        <span>Watch Video</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
