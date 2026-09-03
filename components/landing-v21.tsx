import CapabilitiesSection from "@/components/v21/CapabilitiesSection";
import FinalCTA from "@/components/v21/FinalCTA";
import Footer from "@/components/v21/Footer";
import Hero from "@/components/v21/Hero";
import PositioningSection from "@/components/v21/PositioningSection";
import ProcessSection from "@/components/v21/ProcessSection";
import ProjectTypes from "@/components/v21/ProjectTypes";
import TechnicalCenter from "@/components/v21/TechnicalCenter";
import PreStudy from "@/components/prestudy/PreStudy";

export default function LandingV21() {
  return <div className="v21-home"><main><Hero /><PositioningSection /><CapabilitiesSection /><ProcessSection /><PreStudy /><ProjectTypes /><TechnicalCenter /><FinalCTA /></main><Footer /></div>;
}
