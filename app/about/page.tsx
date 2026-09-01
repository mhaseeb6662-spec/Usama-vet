import { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import FounderSection from "@/components/about/FounderSection";
import MissionVision from "@/components/about/MissionVision";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import JourneyVideos from "@/components/about/JourneyVideos";
import BusinessValues from "@/components/about/BusinessValues";
import AboutFinalCTA from "@/components/about/AboutFinalCTA";
import { getAboutVideos } from "@/lib/data/aboutVideos";

export const metadata: Metadata = {
  title: "About Us | Veterinary & Animal Care Products in Pakistan | Usama Vet",
  description: "Learn about Usama Vet Care, your trusted destination for veterinary medicines, livestock products, poultry supplements, and pet care essentials in Pakistan.",
  alternates: {
    canonical: "/about",
  },
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const videos = await getAboutVideos();

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <AboutHero />
      <OurStory />
      <FounderSection />
      <MissionVision />
      <WhyChooseUs />
      <JourneyVideos videos={videos} />
      <BusinessValues />
      <AboutFinalCTA />
    </main>
  );
}
