import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { WealthManagersSection } from "@/components/sections/WealthManagersSection";
import { FamiliesSection } from "@/components/sections/FamiliesSection";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <WealthManagersSection />
        <FamiliesSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
