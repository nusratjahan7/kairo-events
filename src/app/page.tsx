import Banner from "@/components/homepage/Banner";
import FAQ from "@/components/homepage/FAQ";
import LuxuryMarquee from "@/components/homepage/Marquee";
import TeamSection from "@/components/homepage/TeamSection";

export default function Home() {
  return (
    <div>
      <Banner />
      <LuxuryMarquee />
      <TeamSection />
      <FAQ />
    </div>
  );
}
