const Banner = () => {
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
      {/* Overlay for legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/60" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a]/70 via-transparent to-[#0a0a0a]/30" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-350 items-end justify-between gap-6 px-6 pb-14 md:px-10 md:pb-16">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#d9d9d9]">
            Event only
            <br />
            in Dallas, Texas
          </p>
          <h1 className="text-[13vw] leading-[0.95] font-extrabold uppercase tracking-tight text-[#c8f542] sm:text-[9vw] md:text-[80px] lg:text-[96px]">
            Kairo Dallas
          </h1>
        </div>

        <a
          href="#"
          className="hidden shrink-0 rounded-full bg-[#c8f542] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-widest text-[#0a0a0a] transition-transform hover:scale-105 sm:inline-block"
        >
          All Events
        </a>
      </div>
    </section>
  );
};

export default Banner;
