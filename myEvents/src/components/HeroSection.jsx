import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "../context/EventContext";
import { requireAuth } from "../utils/requireAuth";

function HeroSection() {
  const { state } = useEventContext();
  const navigate = useNavigate();

  const goToEvents = () => {
    const ok = requireAuth(state.isAuthenticated, navigate, "/events");
    if (ok) navigate("/events");
  };

  return (
    <section className="hero-section">
      <div className="hero-text">
        <h1>
          Discover, Plan, and Host <span className="accent">Amazing Events</span>
        </h1>
        <p>
          From corporate meetups to epic parties — manage your events with ease on myEvents.
        </p>

        <button className="btn-primary" onClick={goToEvents}>
          Explore Events
        </button>
      </div>

      <div className="hero-images">
        <motion.img
          src="/images/coperaEvent.jpg"
          alt="Corporate Event"
          className="hero-img"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />
        <motion.img
          src="/images/partyevents.jpeg"
          alt="Party Event"
          className="hero-img"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        />
      </div>
    </section>
  );
}

export default HeroSection;
