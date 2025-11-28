import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "../context/EventContext";
import { requireAuth } from "../utils/requireAuth";

function StartHostingSection() {
  const navigate = useNavigate();
  const { state } = useEventContext();

  const startCreating = () => {
    const ok = requireAuth(state.isAuthenticated, navigate, "/create");
    if (ok) navigate("/create");
  };

  return (
    <section className="host-section">
      <div className="host-overlay">
        <motion.div
          className="host-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            Start hosting your <span className="accent-text">events</span> today
          </h2>
          <p>
            Whether it's a conference, concert, or community meetup — share your
            vision with the world and grow your audience effortlessly with
            <strong> myEvents.</strong>
          </p>

          <button className="host-btn" onClick={startCreating}>
            Create Your Event
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default StartHostingSection;
