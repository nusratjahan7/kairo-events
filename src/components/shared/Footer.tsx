"use client";
import { motion, Variants } from "framer-motion";

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };
  const lineVariants: Variants = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  return (
    <footer className="w-full bg-[#0a0a0a] text-[#ededed] font-sans overflow-hidden">
      {/* TOP SECTION: Grid columns separated by fine borders */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 border-t border-[#ededed]/20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* BLCK. 01 */}
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#ededed]/20 flex flex-col justify-between min-h-70">
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-widest font-mono text-[#ededed]/60">
              BLCK. 01
            </span>
            <div className="w-2 h-2 bg-[#c8f542]" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 text-sm uppercase tracking-wider font-medium">
            <div className="flex flex-col gap-2">
              <motion.a
                variants={itemVariants}
                href="#"
                className="hover:text-[#c8f542] transition-colors duration-300"
              >
                Method
              </motion.a>
              <motion.a
                variants={itemVariants}
                href="#"
                className="hover:text-[#c8f542] transition-colors duration-300"
              >
                Company
              </motion.a>
              <motion.a
                variants={itemVariants}
                href="#"
                className="hover:text-[#c8f542] transition-colors duration-300"
              >
                Projects
              </motion.a>
              <motion.a
                variants={itemVariants}
                href="#"
                className="hover:text-[#c8f542] transition-colors duration-300"
              >
                Contact
              </motion.a>
            </div>
            <div className="flex flex-col gap-2 text-[#ededed]/80">
              <motion.a
                variants={itemVariants}
                href="#"
                className="hover:text-[#c8f542] transition-colors duration-300"
              >
                Kairo Studio
              </motion.a>
              <motion.a
                variants={itemVariants}
                href="#"
                className="hover:text-[#c8f542] transition-colors duration-300"
              >
                Kairo Engine
              </motion.a>
              <motion.a
                variants={itemVariants}
                href="#"
                className="hover:text-[#c8f542] transition-colors duration-300"
              >
                Kairo Lab
              </motion.a>
              <motion.a
                variants={itemVariants}
                href="#"
                className="hover:text-[#c8f542] transition-colors duration-300"
              >
                Kairo System®
              </motion.a>
            </div>
          </div>
        </div>

        {/* BLCK. 02 */}
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#ededed]/20 flex flex-col justify-between min-h-70">
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-widest font-mono text-[#ededed]/60">
              BLCK. 02
            </span>
            <div className="w-2 h-2 bg-[#c8f542]" />
          </div>
          <div className="flex flex-col gap-2 mt-8 text-sm uppercase tracking-wider font-medium">
            <motion.a
              variants={itemVariants}
              href="#"
              className="hover:text-[#c8f542] transition-colors duration-300"
            >
              Digitalization
            </motion.a>
            <motion.a
              variants={itemVariants}
              href="#"
              className="hover:text-[#c8f542] transition-colors duration-300"
            >
              Sustainability
            </motion.a>
            <motion.a
              variants={itemVariants}
              href="#"
              className="hover:text-[#c8f542] transition-colors duration-300"
            >
              Certification
            </motion.a>
            <motion.a
              variants={itemVariants}
              href="#"
              className="hover:text-[#c8f542] transition-colors duration-300"
            >
              FAQs
            </motion.a>
          </div>
        </div>

        {/* BLCK. 03 */}
        <div className="p-8 md:p-12 flex flex-col justify-between min-h-[280px]">
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-widest font-mono text-[#ededed]/60">
              BLCK. 03
            </span>
            <div className="w-2 h-2 bg-[#c8f542]" />
          </div>
          <div className="flex flex-col justify-between h-full mt-8">
            <motion.a
              variants={itemVariants}
              href="#"
              className="text-sm uppercase tracking-wider font-medium hover:text-[#c8f542] transition-colors duration-300"
            >
              LinkedIn
            </motion.a>
            <motion.div
              variants={itemVariants}
              className="text-xs tracking-wider font-mono mt-auto"
            >
              <span className="text-[#c8f542] font-bold">IT&apos;S</span>{" "}
              <span className="text-[#ededed]/40">|</span> EN
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* MIDDLE SECTION: Massive Animated Brand Name */}
      <div className="relative border-t border-[#ededed]/20 bg-[#0d0d0d] select-none py-4 md:py-0">
        <div className="overflow-hidden flex items-center justify-center w-full">
          <motion.h1
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[14vw] font-black tracking-tighter leading-none uppercase text-[#ededed] flex items-center justify-center gap-[2vw]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-[10vw] h-[10vw] min-w-7.5 min-h-7.5 self-center"
            >
              <path
                d="M12 2 4 7v10l8 5 8-5V7l-8-5Z"
                stroke="#c8f542"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Kairo</span>
          </motion.h1>
        </div>
      </div>

      {/* BOTTOM SECTION: Legal & Copyright Footer Bar */}
      <motion.div
        className="relative border-t border-[#ededed]/10 px-6 py-6 text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#ededed]/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* Animated accent horizontal rule line right above the legal bar */}
        <motion.div
          variants={lineVariants}
          className="absolute top-0 left-0 right-0 h-[1px] bg-[#c8f542] origin-left"
        />

        <div>©2026 KAIRO</div>
        <div className="hover:text-[#ededed] cursor-pointer transition-colors">
          Terms and Conditions
        </div>
        <div className="hover:text-[#ededed] cursor-pointer transition-colors">
          Privacy Policy
        </div>
        <div className="md:text-right text-[#ededed]/30">
          Website by Kairo Studio
        </div>
      </motion.div>
    </footer>
  );
}
