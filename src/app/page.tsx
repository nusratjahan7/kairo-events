import Banner from "@/components/homepage/Banner";
import FAQ from "@/components/homepage/FAQ";
import LuxuryMarquee from "@/components/homepage/Marquee";

export default function Home() {
  return (
    <div>
      <Banner />
      <LuxuryMarquee />
      <FAQ />
    </div>
  );
}
