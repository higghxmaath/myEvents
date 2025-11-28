import { motion } from "framer-motion";

function Footer() {
  return (
    <footer className="footer">
      <motion.div
        className="footer-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-logo">
          <h2 className="footer-title">
            my<span className="accent-text">events</span>
          </h2>
          <p>
            Connecting people, ideas, and celebrations. Plan, share, and enjoy
            every event — your way.
          </p>
        </div>


        <div className="footer-socials">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </motion.div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} myevents. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
