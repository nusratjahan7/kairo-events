import Marquee from "react-fast-marquee";

const MARQUEE_ITEMS = [
  "KAIRO DALLAS",
  "LIVE DJ SETS",
  "VIP RESERVATIONS",
  "CURATED EXPERIENCES",
  "THE NIGHT IS YOUNG",
];

export default function LuxuryMarquee() {
  return (
    <div className="w-full bg-[#0a0a0a] border-y border-white/10 py-5 select-none overflow-hidden my-10">
      <Marquee speed={60} gradient={false} pauseOnHover={true}>
        <div className="flex items-center uppercase tracking-[0.15em] font-black">
          {MARQUEE_ITEMS.map((item, index) => (
            <div key={index} className="flex items-center">
              {/* Lime Colored Text */}
              <span className="text-[#c8f542] mx-10">{item}</span>
              {/* Optional: Styled separation dot */}
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
