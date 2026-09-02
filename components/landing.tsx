import { ContactSection } from "@/components/landing/contact-section";
import { FaqSection } from "@/components/landing/faq-section";
import { ExploreSection } from "@/components/landing/explore-section";
import { Hero } from "@/components/landing/hero";
import { ProcessSection } from "@/components/landing/process-section";
import { ProjectsSection } from "@/components/landing/projects-section";
import { ServicesSection } from "@/components/landing/services-section";
import { SiteHeader } from "@/components/landing/site-shell";
import { TrustSection } from "@/components/landing/trust-section";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <SiteHeader />
      <main><Hero /><ServicesSection /><ProcessSection /><ProjectsSection /><TrustSection /><ExploreSection /><FaqSection /><ContactSection /></main>
    </div>
  );
}
