"use client";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

const teamData: TeamMember[] = [
  {
    id: 1,
    name: "Alex Thorne",
    role: "Chief Executive Officer",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "With over a decade of scaling tech layers in the live entertainment space, Alex leads Kairo's vision to decentralize and secure ticketing operations. Her career includes heavy infrastructure deployments for global festivals, focused on mitigating primary-market scale bottlenecks and engineering low-latency queue architectures.",
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Chief Innovation Officer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "Marcus oversees our dynamic scanning and cryptographically secure ticket pass logic. Passionate about real-time mobile verification, his previous work focused on fraud-preventative digital ecosystems, ensuring massive arenas can process crowd entries in sub-second bursts smoothly.",
  },
  {
    id: 3,
    name: "Sophia Ray",
    role: "Head of Event Operations",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "Sophia bridges the gap between on-site stadium staff and Kairo's core architecture. Having managed logistics for massive stadium tours, she ensures that physical gate layouts, staff scanner training, and backup offline validation nodes function smoothly under intense peak loads.",
  },
  {
    id: 4,
    name: "Daniel Park",
    role: "Lead Smart Contract Architect",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "Daniel engineers the secure protocols that prevent ticketing fraud and scalping on Kairo. By developing highly optimized, low-gas execution layers, he guarantees that secondary-market rules and price ceilings are strictly enforced programmatically at the asset level.",
  },
];

export default function TeamSection() {
  const [activeMember, setActiveMember] = useState<TeamMember>(teamData[0]);

  // Framer Motion Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="w-full bg-[#0a0a0a] text-[#ededed] px-6 py-24 md:px-16 font-sans border-t border-[#ededed]/10">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* LEFT SIDE: Heading & Interactive Team Selector */}
        <div className="lg:col-span-7 pr-16 lg:border-r lg:border-[#ededed]/10 flex flex-col gap-12 w-full">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-light tracking-tight max-w-xl leading-tight"
          >
            Built by leaders who understand the{" "}
            <span className="text-[#c8f542] font-normal">profession.</span>
          </motion.h2>

          {/* Members List Container with clean dividers */}
          <div className="flex flex-col border-t border-[#ededed]/10">
            {teamData.map((member) => {
              const isActive = activeMember.id === member.id;
              return (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  onClick={() => setActiveMember(member)}
                  className="flex items-center gap-6 cursor-pointer group select-none relative py-6 border-b border-[#ededed]/10 w-full"
                >
                  {/* Rounded Profile Image */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#ededed]/10 bg-neutral-900">
                    <Image
                      width={100}
                      height={100}
                      src={member.image}
                      alt={member.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        isActive
                          ? "grayscale-0"
                          : "grayscale opacity-40 group-hover:opacity-70"
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="imageBorder"
                        className="absolute inset-0 border-2 border-[#c8f542] rounded-2xl pointer-events-none"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </div>

                  {/* Name and Designation */}
                  <div>
                    <h3
                      className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${
                        isActive
                          ? "text-[#c8f542]"
                          : "text-[#ededed] group-hover:text-[#ededed]/80"
                      }`}
                    >
                      {member.name}
                    </h3>
                    <p className="text-xs md:text-sm text-[#ededed]/40 tracking-wide mt-0.5 font-medium">
                      {member.role}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: Dynamic Biography Layout (Mobile-friendly space fix) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5  lg:pl-9 flex flex-col gap-8 lg:gap-12 min-h-fit lg:min-h-112.5 lg:pt-36 justify-between"
        >
          {/* Static introduction top text snippet */}
          <p className="text-sm md:text-base text-[#ededed]/40 font-mono tracking-wide leading-relaxed">
            Our team brings decades of experience in decentralized
            infrastructure, ticketing design, network engineering, and venue
            operations. Together, we are designing a future that is intelligent,
            connected, and human-centered.
          </p>

          {/* Animated changing bio panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMember.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-4 mt-4 lg:mt-auto"
            >
              <div className="h-0.5 bg-[#c8f542] w-10" />
              <p className="text-sm md:text-lg text-[#ededed]/90 leading-relaxed tracking-wide font-light">
                {activeMember.bio}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
