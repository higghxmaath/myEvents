import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HighlightsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then(res => res.json())
      .then(data => {
        const sorted = data
          .filter(e => e.date)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);

        setEvents(sorted);
      })
      .catch(err => console.error("Error fetching events:", err));
  }, []);

  return (
    <section className="highlights-section">
      <div className="highlights-header">
        <h2>
          Highlights from <span className="accentt">Upcoming Events</span>
        </h2>
        <Link to="/events" className="view-all">View All Events →</Link>
      </div>

      <div className="highlight-grid">
        {events.length > 0 ? (
          events.map(event => (
            <div 
              key={event._id || event.id} 
              className="highlight-card"
            >
              <img
                src={
                  event.image ||
                  "https://via.placeholder.com/300x200?text=Event+Image"
                }
                alt={event.title}
                className="highlight-image"
              />

              <div className="highlight-info">
                <h3>{event.title}</h3>

                <p className="event-date">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                <p className="event-location">{event.location}</p>
                <p className="event-location">{event.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No upcoming events yet.</p>
        )}
      </div>
    </section>
  );
}

export default HighlightsSection;
