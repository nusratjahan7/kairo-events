"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  Radio,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.15,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const stats = [
  { value: "50K+", label: "Active Listeners" },
  { value: "200+", label: "Episodes Released" },
  { value: "15+", label: "Global Tech Speakers" },
  { value: "4.9", label: "Average Rating" },
];

const values = [
  {
    icon: Radio,
    title: "Unfiltered Insights",
    desc: "We dive deep into raw conversations with tech leaders, creators, and developers without the corporate fluff.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "TechWave isn't just a broadcast; it's an ecosystem for developers and innovators to connect and grow together.",
  },
  {
    icon: ShieldCheck,
    title: "Credible & Structured",
    desc: "Notes don't fail, structure does. We carefully curate our episodes to bring you actionable engineering knowledge.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen relative overflow-hidden selection:bg-[#c8f542] selection:text-black">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#c8f542]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-neutral-900/50 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 space-y-24 relative z-10">
        {/* ─── 01 HERO SECTION ─── */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            custom={1}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-950 border border-neutral-900 rounded-full text-xs font-black tracking-widest text-[#c8f542] uppercase"
          >
            <Sparkles size={12} /> Inside TechWave
          </motion.div>

          <motion.h1
            custom={2}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]"
          >
            Riding the Next Wave of{" "}
            <span className="text-[#c8f542]">Tech & Culture.</span>
          </motion.h1>

          <motion.p
            custom={3}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg text-neutral-400 font-medium leading-relaxed"
          >
            TechWave is a premier podcast platform and community built for
            developers, designers, and tech innovators. We capture the stories
            behind the code, the failures before the scale, and the
            breakthroughs shaping tomorrow.
          </motion.p>
        </section>

        {/* ─── 02 STATS GRID ─── */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-neutral-950 border border-neutral-900 rounded-3xl shadow-2xl relative"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 space-y-1 border-r last:border-r-0 border-neutral-900/60 max-md:even:border-r-0"
            >
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.section>

        {/* ─── 03 MISSION & IMAGE SECTION ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-black uppercase tracking-widest text-neutral-500">
              Our Core Mission
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Notes don't fail,{" "}
              <span className="italic text-[#c8f542]">structure does.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-medium leading-relaxed">
              We believe knowledge is only as good as how it is shared. That's
              why every episode we produce is engineered to provide deep,
              structured value. No endless loops of small talk—just high-signal
              insights that make you a better web developer, creator, and
              thinker.
            </p>
          </motion.div>

          {/* প্রফেশনাল মিনিমালিস্ট প্লেসহোল্ডার ইমেজ (Tech Studio Feel) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aspect-video w-full bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl group relative"
          >
            <img
              src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800"
              alt="TechWave Podcast Studio"
              className="object-cover w-full h-full opacity-65 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          </motion.div>
        </section>

        {/* ─── 04 VALUES SECTION ─── */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#c8f542]">
              What Drives Us
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Our Core Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 bg-neutral-950 border border-neutral-900 rounded-2xl hover:border-neutral-800 transition-colors space-y-4 shadow-xl"
                >
                  <div className="p-3 bg-neutral-900 text-[#c8f542] w-fit rounded-xl border border-neutral-800">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-black text-neutral-100">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 05 CTA BANNER ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 rounded-3xl text-center space-y-6 flex flex-col items-center justify-center relative shadow-2xl"
        >
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ready to Tune In?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
              Explore our featured episodes and level up your engineering &
              frontend development stack today.
            </p>
          </div>
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c8f542] hover:bg-[#b8e232] text-black rounded-xl font-black text-sm transition-all duration-300 shadow-md group"
          >
            Listen to TechWave{" "}
            <ArrowUpRight
              size={16}
              className="group-hover:rotate-45 transition-transform"
            />
          </Link>
        </motion.section>
      </div>
    </main>
  );
}
