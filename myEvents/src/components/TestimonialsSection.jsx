import { motion } from "framer-motion";


const testimonials = [
  {
    name: "David A.",
    role: "Event Organizer",
    quote:
      "myEvents made organizing my corporate summit effortless. The RSVP system and event dashboard saved me hours of coordination.",
    
  },
  {
    name: "Sophia L.",
    role: "Party Host",
    quote:
      "I hosted my 30th birthday with myEvents and it was seamless! Friends could RSVP and get reminders automatically.",
   
  },
  {
    name: "James O.",
    role: "Community Manager",
    quote:
      "As someone who runs weekly meetups, myEvents is my go-to. It’s easy, elegant, and reliable for every event I run.",
    
  },
];

function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <motion.h2
        className="testimonials-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        What our users say
      </motion.h2>

      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
           
            <p className="testimonial-quote">“{t.quote}”</p>
            <h4>{t.name}</h4>
            <span>{t.role}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
