import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "../context/EventContext";
import HeroSection from "../components/HeroSection";
import HighlightsSection from "../components/HighlightsSection";
import WhyUseSection from "../components/WhyUseSection";
import StartHostingSection from "../components/StartHostingSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FooterSection from "../components/FooterSection";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { state } = useEventContext();
  const { events } = state;
  const [featured, setFeatured] = useState([]);

  // Get top 3 upcoming events by date
  useEffect(() => {
    if (events && events.length > 0) {
      const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
      setFeatured(sorted.slice(0, 3));
    }
  }, [events]);

  return (
    <div>
        <HeroSection/>
        <HighlightsSection/>
        <WhyUseSection/>
        <StartHostingSection/>
        <TestimonialsSection/>
        <FooterSection/>
    </div>
  );
}

export default Home;
