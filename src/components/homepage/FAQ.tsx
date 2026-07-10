"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowOutward } from "react-icons/md";

// Kairo Event Ticketing FAQ Data
const faqData = [
  {
    id: 1,
    question: "How do I receive my event tickets after purchase?",
    answer:
      "Once your payment is confirmed, your digital tickets are instantly generated. You can download them directly from your dashboard, and a secure copy featuring your unique dynamic QR code will be sent to your registered email.",
  },
  {
    id: 2,
    question: "What is Kairo's refund and ticket transfer policy?",
    answer:
      "Refund policies vary depending on the organizer's terms for each specific event. However, you can securely transfer your tickets to a friend or another user directly from your Kairo account up to 2 hours before the gates open.",
  },
  {
    id: 3,
    question: "Do I need to print my ticket for venue entry?",
    answer:
      "Not at all. Kairo is completely paperless. Just present the digital ticket on your mobile device at the venue entrance. Our high-speed scanners can easily read the dynamic QR codes right from your screen.",
  },
  {
    id: 4,
    question: "What payment methods do you support for ticket bookings?",
    answer:
      "We support a wide array of premium and secure payment gateways, including major local and international credit/debit cards, modern mobile banking layers, and digital wallets to ensure a seamless booking experience.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1); // Defaults to first open

  return (
    <section className="w-full bg-[#0a0a0a] text-[#ededed] px-6 pb-20 md:px-16 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 pb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#ededed]">
            Have questions?
          </h2>
          <p className="text-3xl md:text-5xl font-light tracking-tight text-[#ededed]/40 mt-1">
            Find answers.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 text-xs md:text-sm">
          <span className="text-[#ededed]/40 font-mono tracking-wider">
            Any more questions?
          </span>
          <a
            href="#contact"
            className="group flex items-center gap-1 font-medium text-[#ededed] hover:text-[#c8f542] transition-colors duration-300"
          >
            Contact us
            <span className="text-xs text-[#c8f542] transform pt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
              <MdArrowOutward />
            </span>
          </a>
        </div>
      </div>

      {/* ACCORDION ITEMS */}
      <div className="border-t border-[#ededed]/10">
        {faqData.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div key={item.id} className="border-b border-[#ededed]/10">
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full text-left py-6 md:py-8 flex justify-between items-center group transition-colors focus:outline-none"
              >
                <span
                  className={`text-base md:text-xl tracking-tight transition-colors duration-300 ${isOpen ? "text-[#c8f542]" : "text-[#ededed] group-hover:text-[#ededed]/80"}`}
                >
                  {item.question}
                </span>

                <span className="text-lg md:text-xl font-light text-[#ededed]/30 ml-4">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.25 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.15 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <p className="pb-8 text-sm md:text-base leading-relaxed text-[#ededed]/60 max-w-3xl">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
