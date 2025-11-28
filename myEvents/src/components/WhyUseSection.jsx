import { motion } from "framer-motion";
import { Calendar, Users, Rocket } from "@phosphor-icons/react";

function WhyUseSection() {
  const features = [
    {
      icon: <Calendar size={40} weight="fill" />,
      title: "Effortless Event Management",
      text: "Create, organize, and manage all your events in one place — from conferences to celebrations.",
    },
    {
      icon: <Users size={40} weight="fill" />,
      title: "Connect With Attendees",
      text: "Engage your audience, track RSVPs, and keep everyone updated effortlessly.",
    },
    {
      icon: <Rocket size={40} weight="fill" />,
      title: "Grow Your Reach",
      text: "Showcase your events to a wider community and grow your brand or passion projects.",
    },
  ];

  return (
    <section className="why-section">
      <div className="why-container">
        <motion.h2
          className="why-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Why use <span className="accent-text">myevents</span>?
        </motion.h2>

        <div className="why-grid">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="why-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
            >
              <div className="why-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyUseSection;
