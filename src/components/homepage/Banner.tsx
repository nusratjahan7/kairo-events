"use client";
import { motion, Variants } from "framer-motion";

const Banner = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const textRevealVariants: Variants = {
    hidden: { y: "110%" },
    show: {
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
  };

  return (
    <section className="relative flex h-screen w-full items-end overflow-hidden bg-[#0a0a0a]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/assets/banner.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlays - Smooth Cinematic Fade In */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/60"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-0 bg-linear-to-r from-[#0a0a0a]/70 via-transparent to-[#0a0a0a]/30"
      />

      {/* Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-350 items-end justify-between gap-6 px-6 pb-14 md:px-10 md:pb-16"
      >
        <div>
          {/* Subtitle Reveal */}
          <div className="overflow-hidden mb-3">
            <motion.p
              variants={textRevealVariants}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#d9d9d9]"
            >
              Event only
              <br />
              in Dallas, Texas
            </motion.p>
          </div>

          {/* Main Headline Reveal */}
          <div className="overflow-hidden">
            <motion.h1
              variants={textRevealVariants}
              className="text-[13vw] leading-[0.95] font-extrabold uppercase tracking-tight text-[#c8f542] sm:text-[9vw] md:text-[80px] lg:text-[96px]"
            >
              Kairo Dallas
            </motion.h1>
          </div>
        </div>

        {/* Premium Scale & Spring Animated Button */}
        <motion.a
          variants={fadeInVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          href="#"
          className="hidden shrink-0 rounded-full bg-[#c8f542] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-widest text-[#0a0a0a] sm:inline-block"
        >
          All Events
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Banner;
